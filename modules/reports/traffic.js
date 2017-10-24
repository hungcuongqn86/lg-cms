
(function ($, AdminLTE) {
    //get absolute path
    var loc = window.location;
    var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
    var absolutePath = loc.protocol + '//' + loc.host + pathName;
    //backend url
    var backendurl = absolutePath + 'modules/inc/reports.php';

    $('.select-box').selectctr();

    $('#btn-refresh').on( 'click', function () {
        getTraffic();
    });

    $('#btn-refresh-2').on( 'click', function () {
        getTrafficLocation();
    });

    var date_start = Date.parse($('#curr-server-date').val()).add(-6).days().toString('d/M/yyyy');
    var date_end = Date.parse($('#curr-server-date').val()).toString('d/M/yyyy');

    $('#option-date').on( 'change', function () {
        if($(this).val() == 'today'){
            date_start = Date.parse($('#curr-server-date').val()).toString('d/M/yyyy');
            date_end = Date.parse($('#curr-server-date').val()).toString('d/M/yyyy');
        }
        if($(this).val() == 'yesterday'){
            date_start = Date.parse($('#curr-server-date').val()).add(-1).days().toString('d/M/yyyy');
            date_end = Date.parse($('#curr-server-date').val()).toString('d/M/yyyy');
        }
        if($(this).val() == 'last7days'){
            date_start = Date.parse($('#curr-server-date').val()).add(-6).days().toString('d/M/yyyy');
            date_end = Date.parse($('#curr-server-date').val()).toString('d/M/yyyy');
        }
        if($(this).val() == 'last28days'){
            date_start = Date.parse($('#curr-server-date').val()).add(-27).days().toString('d/M/yyyy');
            date_end = Date.parse($('#curr-server-date').val()).toString('d/M/yyyy');
        }
        if($(this).val() == 'customize'){
            $('.customize-date').show();
            return;
        }
        else{
            $('.customize-date').hide();
        }
        getData();
    });

    $('.date-ranger-picker').daterangepicker({
        locale: {
            format: 'DD/MM/YYYY'
        }
    },
    function(start, end) {
        date_start = start.format('DD/MM/YYYY');
        date_end = end.format('DD/MM/YYYY');
        getData();
    });

    function round(value, decimals) {
        if(!decimals) decimals = 0;
        return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
    }

    //func get overview
    function getTrafficOverview(){
        $.ajax({
            url: backendurl,
            type: "GET",
            dataType: 'json',
            data: {
                cmd: 'getTrafficOverview',
                start: date_start,
                end: date_end
            },
            success: function (data) {
                if(data && data.result) {                         
                    //jvectormap data
                    var visitorsData = {};
                    var orderData = {};
                    $.each(data.result, function(i,row){
                        visitorsData[row.S_COUNTRY_CODE] = row.COUNT_VISIT;
                    });
                    $.each(data.result2, function(i,row){
                        orderData[row.S_COUNTRY] = row.TOTAL_ORDER;
                    });
                    //World map by jvectormap
                    $('#traffic-map').html('');
                    $('#traffic-map').vectorMap({
                        map: 'world_mill_en',
                        backgroundColor: "transparent",
                        regionStyle: {
                        initial: {
                            fill: '#b4e1fa',
                            "fill-opacity": 1,
                            stroke: 'none',
                            "stroke-width": 0,
                            "stroke-opacity": 1
                        }
                        },
                        series: {
                        regions: [{
                            values: visitorsData,
                            scale: ["#1498ea", "#084e8a"],
                            normalizeFunction: 'polynomial'
                        }]
                        },
                        onRegionLabelShow: function (e, el, code) {
                        if (typeof visitorsData[code] != "undefined")
                            if (typeof orderData[code] != "undefined"){
                                var conv_rate = round(parseInt(orderData[code])/parseInt(visitorsData[code])*100,2);
                                el.html(el.html() + ': ' + visitorsData[code] + ' viewed, ' + orderData[code] + ' total sales, conv. rate = ' + conv_rate + '%' );
                            }
                            else{
                                el.html(el.html() + ': ' + visitorsData[code] + ' viewed, 0 total sales, conv. rate = 0%' );
                            }
                        }
                    });
                }
            },
            error: function () {
                openModalError();
            }
        });
    }

    var chk_firsttime = 0;
    function getTraffic(){
        $('#tb-traffic-loader').show();
        if(chk_firsttime == 0){
            chk_firsttime = 1;
            $("#tb-traffic").DataTable({
                'columnDefs': [
                    {'targets': 0, 'orderable': false,
                        'data': null,
                        'render': function ( data, type, full, meta ) {
                            return meta.row + meta.settings._iDisplayStart + 1;
                        }
                    },
                    {'targets': 1,
                        'data': null,
                        'render': function ( data, type, full, meta ) {
                            var date_range = ($('#option-date').val() == 'today')?'Today':date_start + ' - ' + date_end;
                            return date_range;
                        }
                    },
                    {'targets': 4,
                        'data': null,
                        'render': function ( data, type, full, meta ) {
                            var total_traffic = (data.TOTAL_TRAFFIC)?data.TOTAL_TRAFFIC:0;
                            return total_traffic;
                        }
                    },
                    {'targets': 5,
                        'data': null,
                        'render': function ( data, type, full, meta ) {
                            var total_order = (data.TOTAL_ORDER)?data.TOTAL_ORDER:0;
                            return total_order;
                        }
                    },
                    {'targets': 6,
                        'data': null,
                        'render': function ( data, type, full, meta ) {
                            var conv_rate = (data.TOTAL_ORDER && data.TOTAL_TRAFFIC)?round(parseInt(data.TOTAL_ORDER)/parseInt(data.TOTAL_TRAFFIC)*100,2):0;
                            return conv_rate + '%';
                        }
                    },
                    {'targets': 7,
                        'data': null,
                        'render': function ( data, type, full, meta ) {
                            var total_amount = (data.TOTAL_AMOUNT)?data.TOTAL_AMOUNT:0;
                            return total_amount;
                        }
                    }
                ],
                'aaSorting': [[4, 'desc']],
                'processing': true,
                'serverSide': true,
                'ajax': {
                    url: backendurl + "?cmd=getTrafficData",
                    data: function ( d ) {
                        d.startdate = date_start;
                        d.enddate = date_end;
                    },
                    error: function () {
                        openModalError();
                    }
                },
                "columns": [
                    { "data": null },
                    { "data": null },
                    { "data": 'S_SOURCE' },
                    { "data": 'S_MEDIUM' },
                    { "data": null },
                    { "data": null },
                    { "data": null },
                    { "data": null }
                ],
                'fnDrawCallback' : function() {
                    $('#tb-traffic-loader').hide();
                },
                processing: false
            });
        }
        else{
            $("#tb-traffic").DataTable().ajax.reload();
        }
    }

    var chk_firsttime_loc = 0;
    function getTrafficLocation(){
        $('#tb-traffic-location-loader').show();
        if(chk_firsttime_loc == 0){
            chk_firsttime_loc = 1;
            $("#tb-traffic-location").DataTable({
                'columnDefs': [
                    {'targets': 0, 'orderable': false,
                        'data': null,
                        'render': function ( data, type, full, meta ) {
                            return meta.row + meta.settings._iDisplayStart + 1;
                        }
                    },
                    {'targets': 1,
                        'data': null,
                        'render': function ( data, type, full, meta ) {
                            var date_range = ($('#option-date').val() == 'today')?'Today':date_start + ' - ' + date_end;
                            return date_range;
                        }
                    },
                    {'targets': 3,
                        'data': null,
                        'render': function ( data, type, full, meta ) {
                            var total_traffic = (data.TOTAL_TRAFFIC)?data.TOTAL_TRAFFIC:0;
                            return total_traffic;
                        }
                    },
                    {'targets': 4,
                        'data': null,
                        'render': function ( data, type, full, meta ) {
                            var total_order = (data.TOTAL_ORDER)?data.TOTAL_ORDER:0;
                            return total_order;
                        }
                    },
                    {'targets': 5,
                        'data': null,
                        'render': function ( data, type, full, meta ) {
                            var conv_rate = (data.TOTAL_ORDER && data.TOTAL_TRAFFIC)?round(parseInt(data.TOTAL_ORDER)/parseInt(data.TOTAL_TRAFFIC)*100,2):0;
                            return conv_rate + '%';
                        }
                    },
                    {'targets': 6,
                        'data': null,
                        'render': function ( data, type, full, meta ) {
                            var total_amount = (data.TOTAL_AMOUNT)?data.TOTAL_AMOUNT:0;
                            return total_amount;
                        }
                    }
                ],
                'aaSorting': [[3, 'desc']],
                'processing': true,
                'serverSide': true,
                'ajax': {
                    url: backendurl + "?cmd=getTrafficLocationData",
                    data: function ( d ) {
                        d.startdate = date_start;
                        d.enddate = date_end;
                    },
                    error: function () {
                        openModalError();
                    }
                },
                "columns": [
                    { "data": null },
                    { "data": null },
                    { "data": 'S_COUNTRY_CODE' },
                    { "data": null },
                    { "data": null },
                    { "data": null },
                    { "data": null }
                ],
                'fnDrawCallback' : function() {
                    $('#tb-traffic-location-loader').hide();
                },
                processing: false
            });
        }
        else{
            $("#tb-traffic-location").DataTable().ajax.reload();
        }
    }

    function getData(){
        getTrafficOverview();
        getTraffic();
        getTrafficLocation();
    }

    //ready function
    getData();

    $('#btn-source-apply').on('click', function (e) {
        $('.dropdown-setting').removeClass('open');
        $.each($(".chk-col-source"), function(i,item){
            if($(this).is(':checked')){
                $("#tb-traffic").DataTable().column($(this).attr('colnumb')).visible(true);
            }
            else{
                $("#tb-traffic").DataTable().column($(this).attr('colnumb')).visible(false);
            }
        });
    });

    $('#btn-location-apply').on('click', function (e) {
        $('.dropdown-setting').removeClass('open');
        $.each($(".chk-col-location"), function(i,item){
            if($(this).is(':checked')){
                $("#tb-traffic-location").DataTable().column($(this).attr('colnumb')).visible(true);
            }
            else{
                $("#tb-traffic-location").DataTable().column($(this).attr('colnumb')).visible(false);
            }
        });
    });

})(jQuery, $.AdminLTE);