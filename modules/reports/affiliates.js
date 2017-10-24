
(function ($, AdminLTE) {
    //get absolute path
    var loc = window.location;
    var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
    var absolutePath = loc.protocol + '//' + loc.host + pathName;
    //backend url
    var backendurl = absolutePath + 'modules/inc/reports.php';

    $('.select-box').selectctr();

    $('#btn-refresh').on( 'click', function () {
        getAffiliates();
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
    function getOverview(){
        $.ajax({
            url: backendurl,
            type: "GET",
            dataType: 'json',
            data: {cmd: 'getOverview',
                   start: date_start,
                   end: date_end
                  },
            success: function (data) {
                if(data.result){
                    var label = [];
                    var chart_data = [];
                    var chart_conv = [];
                    var revenue_data = [];
                    total_order = 0;
                    revenue = 0;
                    $.each(data.result, function(i,row){
                        label.push(row.CREATE_DATE);
                        chart_data.push(parseInt(row.TOTAL_ORDER));
                        if(row.REVENUE) revenue_data.push(parseFloat(row.REVENUE));
                        else revenue_data.push(0);
                        total_order += parseInt(row.TOTAL_ORDER);
                        if(row.REVENUE) revenue += parseFloat(row.REVENUE);
                    });
                    $('#campaign-statics').text(total_order);

                    if(revenue>1000) revenue = Math.round(revenue/1000,2) + 'k';
                    else revenue = Math.round(revenue,2);
                    $('#revenue-statics').text('$'+revenue);
                    $.each(data.result2, function(i,row){
                        var percent = 0;
                        if(parseInt(row.TOTAL_TRAFFIC)) percent = round(parseInt(chart_data[i])/parseInt(row.TOTAL_TRAFFIC)*100);
                        chart_conv.push(percent);
                    });
                    if(label.length > 15){
                        for (var i = 0, len = label.length; i < len; i++) {
                            if(i%3 != 0) 
                            label[i] = '';
                        }
                    }
                    Highcharts.chart('overview', {
                        chart: {
                            zoomType: 'x'
                        },
                        title: {
                            text: ''
                        },
                        xAxis: [{
                            categories: label,
                            crosshair: true
                        }],
                        yAxis:  [{
                            min: 0,
                            title: {
                                text: '',
                            }
                        }, { // Secondary yAxis
                            min: 0,
                            title: {
                                text: '',
                            },
                            labels: {
                                format: '{value} %',
                            },
                            opposite: true
                        }],
                        legend: {
                        align: 'left',
                        x: 0,
                        verticalAlign: 'top',
                        y: 0,
                        floating: true,
                        backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white'
                        },
                        plotOptions: {
                            area: {
                                fillColor: {
                                    stops: [
                                        [0, Highcharts.getOptions().colors[0]],
                                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                                    ]
                                },
                                marker: {
                                    enabled: ($('#option-date').val() == 'today')?true:false,
                                    radius: 5,
                                    states: {
                                        hover: {
                                            enabled: true
                                        }
                                    }
                                },
                                lineWidth: 4,
                                states: {
                                    hover: {
                                        lineWidth: 4
                                    }
                                },
                                threshold: null
                            }
                        },
                
                        series: [
                            {
                                type: 'area',
                                yAxis: 0,
                                name: 'Total sale',
                                data: chart_data,
                                color: '#03be5b'
                            },
                            {
                                type: 'area',
                                yAxis: 1,
                                name: 'Conv.',
                                data: chart_conv,
                                color: '#d33131',
                                tooltip: {
                                    valueSuffix: '%'
                                }
                            }
                    ]
                    });
                }
            },
            error: function () {
                openModalError();
            }
        });
    }

    var chk_firsttime = 0;
    function getAffiliates(){
        $('#tb-affiliates-loader').show();
        if(chk_firsttime == 0){
            chk_firsttime = 1;
            $("#tb-affiliates").DataTable({
                'columnDefs': [
                    {'targets': 0, className: 'table-col-design',
                        'data': null,
                        'render': function ( data, type, full, meta ) {
                            var user_name = data.USER_EMAIL;
                            if(data.USER_NAME) user_name = data.USER_NAME + '<br>' + data.USER_EMAIL;
                            user_name = '<span class="affiliate-label label-link" userid="' + data.USER_ID + '">' + user_name + '</span>';
                            return user_name;
                        }
                    },
                    {'targets': 1,
                        'data': null,
                        'render': function ( data, type, full, meta ) {
                            var total_campaign = 0;
                            if(data.TOTAL_CAMPAIGN) total_campaign = data.TOTAL_CAMPAIGN;
                            return total_campaign;
                        }
                    },
                    {'targets': 2,
                        'data': null,
                        'render': function ( data, type, full, meta ) {
                            var total_sale = 0;
                            if(data.TOTAL_SALE) total_sale = data.TOTAL_SALE;
                            return total_sale;
                        }
                    },
                    {'targets': 3,
                        'data': null,
                        'render': function ( data, type, full, meta ) {
                            var revenue = '$0';
                            if(data.REVENUE) revenue = '$'+data.REVENUE;
                            return revenue;
                        }
                    },
                    {'targets': 4,
                        'data': null,
                        'render': function ( data, type, full, meta ) {
                            var total_traffic = '0';
                            if(data.TOTAL_TRAFFIC) total_traffic = data.TOTAL_TRAFFIC;
                            return total_traffic;
                        }
                    },
                    {'targets': 6,
                        'data': null,
                        'render': function ( data, type, full, meta ) {
                            var conv_rate = (data.TOTAL_SALE && data.TOTAL_TRAFFIC)?round((parseFloat(data.TOTAL_SALE)/parseFloat(data.TOTAL_TRAFFIC)*100),2):0;
                            return conv_rate + '%';
                        }
                    }
                ],
                'aaSorting': [[2, 'desc']],
                'processing': true,
                'serverSide': true,
                'ajax': {
                    url: backendurl + "?cmd=getAffiliatesData",
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
                    { "data": null },
                    { "data": null },
                    { "data": null },
                    { "data": 'S_COUNTRY' },
                    { "data": null },
                    { "data": 'JOIN_DATE' },
                    { "data": 'S_STATE' },
                ],
                "fnDrawCallback" : function() {
                    $('#tb-affiliates-loader').hide();
                },
                processing: false
            });
        }
        else{
            $("#tb-affiliates").DataTable().ajax.reload();
        }
    }

    function getData(){
        getAffiliates();
        getOverview();
    }

    //ready function
    getData();

    $('#btn-affiliate-apply').on('click', function (e) {
        $('.dropdown-setting').removeClass('open');
        $.each($(".chk-col-affiliate"), function(i,item){
            if($(this).is(':checked')){
                $("#tb-affiliates").DataTable().column($(this).attr('colnumb')).visible(true);
            }
            else{
                $("#tb-affiliates").DataTable().column($(this).attr('colnumb')).visible(false);
            }
        });
    });

    $('#tb-affiliates').on('draw.dt', function() {
        $('.affiliate-label').off('click').on('click', function (e) {
            openModalAffiliate($(this).attr('userid'),date_start,date_end);
        });
    });

})(jQuery, $.AdminLTE);