
(function ($, AdminLTE) {
    //get absolute path
    var loc = window.location;
    var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
    var absolutePath = loc.protocol + '//' + loc.host + pathName;
    //backend url
    var backendurl = absolutePath + 'modules/inc/reports.php';

    $('.select-box').selectctr();

    $('#btn-refresh').on( 'click', function () {
        getCampaigns();
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
    function getCampaigns(){
        $('#tb-campaigns-loader').show();
        if(chk_firsttime == 0){
            chk_firsttime = 1;
            $("#tb-campaigns").DataTable({
                'columnDefs': [
                    {'targets': 0,
                        'data': null,
                        'render': function ( data, type, full, meta ) {
                            var camp_name = '<span class="campaign-label label-link" campid="' + data.S_ID + '">' + data.CAMPAIGN_NAME + '</span>';
                            return camp_name;
                        }
                    },
                    {'targets': 1, 'orderable': false,
                        'data': null,
                        'render': function ( data, type, full, meta ) {
                            var camp_id = '<span class="campid-label label-link">' + data.S_ID + '</span>';
                            return camp_id;
                        }
                    },
                    {'targets': 2, 'orderable': false,
                        'data': null,
                        'render': function ( data, type, full, meta ) {
                            var user_name = data.USER_EMAIL;
                            if(data.USER_NAME) user_name = data.USER_NAME + '<br>' + data.USER_EMAIL;
                            user_name = '<span class="affiliate-label label-link" userid="' + data.USER_ID + '">' + user_name + '</span>';
                            return user_name;
                        }
                    },
                    {'targets': 3,
                        'data': null,
                        'render': function ( data, type, full, meta ) {
                            //Get design image
                            var img1 = '<img src="'+absolutePath+'resource/image/default.png" style="max-width:40px;max-height:40px"/>';
                            var img2 = '<img src="'+absolutePath+'resource/image/default.png" style="max-width:40px;max-height:40px"/>';
                            
                            if(data.S_FRONT_IMG_URL) var front_img_url = data.S_FRONT_IMG_URL;
                            else if(data.S_FRONT_IMG_URL_2) var front_img_url = data.S_FRONT_IMG_URL_2;
                            
                            
                            if(data.S_BACK_IMG_URL) var back_img_url = data.S_BACK_IMG_URL;
                            else if(data.S_BACK_IMG_URL_2) var back_img_url = data.S_BACK_IMG_URL_2;

                            if(data.N_BACK_VIEW == 0){
                                if(front_img_url) img1 = '<img src="'+front_img_url+'" style="max-width:40px;max-height:40px"/>';
                                if(back_img_url) img2 = '<img src="'+back_img_url+'" style="max-width:40px;max-height:40px"/>';
                            }
                            else{
                                if(front_img_url) img1 = '<img src="'+back_img_url+'" style="max-width:40px;max-height:40px"/>';
                                if(back_img_url) img2 = '<img src="'+front_img_url+'" style="max-width:40px;max-height:40px"/>';
                            }

                            var col_design = '<div class="design-img-table img-campaign-design" style="cursor:pointer;" campid="' + data.S_ID + '"><div class="design-img-cell">'+img1+'</div><div class="design-img-cell">'+img2+'</div></div>';
                            return col_design;
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
                            var unit = 'USD';
                            return unit;
                        }
                    },
                    {'targets': 6,
                        'data': null,
                        'render': function ( data, type, full, meta ) {
                            var total_traffic = (data.TOTAL_TRAFFIC)?data.TOTAL_TRAFFIC:0;
                            return total_traffic;
                        }
                    },
                    {'targets': 7,
                        'data': null,
                        'render': function ( data, type, full, meta ) {
                            var conv_rate = (data.TOTAL_ORDER && data.TOTAL_TRAFFIC)?round((parseFloat(data.TOTAL_ORDER)/parseFloat(data.TOTAL_TRAFFIC)*100),2):0;
                            return conv_rate + '%';
                        }
                    }
                ],
                'aaSorting': [[4, 'desc']],
                'processing': true,
                'serverSide': true,
                'ajax': {
                    url: backendurl + "?cmd=getCampaignsData",
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
                    { "data": null },
                    { "data": null },
                    { "data": null },
                    { "data": 'START_DATE' },
                    { "data": 'END_DATE' }
                ],
                'fnDrawCallback' : function() {
                    $('#tb-campaigns-loader').hide();
                },
                processing: false
            });
        }
        else{
            $("#tb-campaigns").DataTable().ajax.reload();
        }
    }

    function getData(){
        getCampaigns();
        getOverview();
    }

    //ready function
    getData();

    $('#btn-campaign-apply').on('click', function (e) {
        $('.dropdown-setting').removeClass('open');
        $.each($(".chk-col-campaign"), function(i,item){
            if($(this).is(':checked')){
                $("#tb-campaigns").DataTable().column($(this).attr('colnumb')).visible(true);
            }
            else{
                $("#tb-campaigns").DataTable().column($(this).attr('colnumb')).visible(false);
            }
        });
    });

    $('#tb-campaigns').on('draw.dt', function() {
        $('.affiliate-label').off('click').on('click', function (e) {
            openModalAffiliate($(this).attr('userid'),date_start,date_end);
        });
        $('.campid-label').off('click').on('click', function (e) {
            openModalCustomer($(this).text(),date_start,date_end);
        });
        $('.campaign-label').off('click').on('click', function (e) {
            openModalCampaign($(this).attr('campid'),'campaign-preview');
        });
        $('.img-campaign-design').off('click').on('click', function (e) {
            openModalCampaign($(this).attr('campid'),'campaign-design');
        });
        
    });
})(jQuery, $.AdminLTE);