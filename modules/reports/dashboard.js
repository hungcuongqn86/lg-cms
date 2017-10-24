
(function ($, AdminLTE) {
    //get absolute path
    var loc = window.location;
    var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
    var absolutePath = loc.protocol + '//' + loc.host + pathName;
    //backend url
    var backendurl = absolutePath + 'modules/inc/reports.php';

    $('.select-box').selectctr();

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

    /**
     * Create a constructor for sparklines that takes some sensible defaults and merges in the individual
     * chart options. This function is also available from the jQuery plugin as $(element).highcharts('SparkLine').
     */
    Highcharts.SparkLine = function (a, b, c) {
        var hasRenderToArg = typeof a === 'string' || a.nodeName,
            options = arguments[hasRenderToArg ? 1 : 0],
            defaultOptions = {
                chart: {
                    renderTo: (options.chart && options.chart.renderTo) || this,
                    backgroundColor: null,
                    borderWidth: 0,
                    type: 'area',
                    margin: [2, 0, 2, 0],
                    style: {
                        overflow: 'visible'
                    },

                    // small optimalization, saves 1-2 ms each sparkline
                    skipClone: true
                },
                title: {
                    text: ''
                },
                credits: {
                    enabled: false
                },
                xAxis: {
                    labels: {
                        enabled: false
                    },
                    title: {
                        text: null
                    },
                    startOnTick: false,
                    endOnTick: false,
                    tickPositions: []
                },
                yAxis: {
                    endOnTick: false,
                    startOnTick: false,
                    labels: {
                        enabled: false
                    },
                    title: {
                        text: null
                    },
                    tickPositions: [0]
                },
                legend: {
                    enabled: false
                },
                tooltip: {
                    backgroundColor: null,
                    borderWidth: 0,
                    shadow: false,
                    useHTML: true,
                    hideDelay: 0,
                    shared: true,
                    padding: 0,
                    positioner: function (w, h, point) {
                        return { x: point.plotX - w / 2, y: point.plotY - h };
                    }
                },
                plotOptions: {
                    series: {
                        animation: false,
                        lineWidth: 2,
                        shadow: false,
                        states: {
                            hover: {
                                lineWidth: 2
                            }
                        },
                        marker: {
                            radius: 2,
                            states: {
                                hover: {
                                    enabled: true
                                }
                            }
                        },
                        fillOpacity: 0
                    }
                }
            };

        options = Highcharts.merge(defaultOptions, options);

        return hasRenderToArg ?
            new Highcharts.Chart(a, options, c) :
            new Highcharts.Chart(options, b);
    };

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

                    if(revenue>1000) revenue = round(revenue/1000,2) + 'k';
                    else revenue = round(revenue,2);
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

                    //Sparkline
                    $('#campaign-statics-chart').highcharts('SparkLine', {
                        series: [{
                            data: chart_data,
                            color: '#03be5b',
                            pointStart: 0
                        }],
                        tooltip: {
                            headerFormat: null,
                            pointFormat: '<b>{point.y}</b> Order items'
                        },
                        plotOptions: {
                            area: {
                                marker: {
                                    enabled: ($('#option-date').val() == 'today')?true:false,
                                }
                            }
                        }
                    });
                    $('#revenue-statics-chart').highcharts('SparkLine', {
                        series: [{
                            data: revenue_data,
                            color: '#03be5b',
                            pointStart: 0
                        }],
                        tooltip: {
                            headerFormat: null,
                            pointFormat: '<b>${point.y}</b>'
                        },
                        plotOptions: {
                            area: {
                                marker: {
                                    enabled: ($('#option-date').val() == 'today')?true:false,
                                }
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

    function getTopAffiliates(){
        $.ajax({
            url: backendurl,
            type: "GET",
            dataType: 'json',
            data: {
                cmd: 'getTopAffiliates',
                start: date_start,
                end: date_end
            },
            success: function (data) {
                table1.clear().draw();
                if(data && data.result) {                         
                    $.each(data.result, function(i,row){
                        var conv_rate = (row.TOTAL_SALE && row.TOTAL_TRAFFIC)?round((parseFloat(row.TOTAL_SALE)/parseFloat(row.TOTAL_TRAFFIC)*100),2):0;

                        var user_name = row.USER_EMAIL;
                        if(row.USER_NAME) user_name = row.USER_NAME + '<br>' + row.USER_EMAIL;
                        user_name = '<span class="affiliate-label label-link" userid="' + row.USER_ID + '">' + user_name + '</span>';
                        table1.row.add([user_name,
                                        row.TOTAL_CAMPAIGN,
                                        (row.TOTAL_SALE)?row.TOTAL_SALE:0,
                                        (row.REVENUE)?'$'+row.REVENUE:'$0',
                                        (row.TOTAL_TRAFFIC)?row.TOTAL_TRAFFIC:0,
                                        row.S_COUNTRY,
                                        conv_rate + '%',
                                        row.JOIN_DATE,
                                        row.S_STATE]).draw( false );            
                    });
                }
            },
            error: function () {
                openModalError();
            }
        });
    }

    function getTopCampaigns(){
        $.ajax({
            url: backendurl,
            type: "GET",
            dataType: 'json',
            data: {
                cmd: 'getTopCampaigns',
                start: date_start,
                end: date_end
            },
            success: function (data) {
                table2.clear().draw();
                if(data && data.result) {                         
                    $.each(data.result, function(i,row){
                        var conv_rate = (row.TOTAL_ORDER && row.TOTAL_TRAFFIC)?round(parseFloat(row.TOTAL_ORDER)/parseFloat(row.TOTAL_TRAFFIC)*100,2):0;

                        //Get design image
                        var img1 = '<img src="'+absolutePath+'resource/image/default.png" style="max-width:40px;max-height:40px"/>';
                        var img2 = '<img src="'+absolutePath+'resource/image/default.png" style="max-width:40px;max-height:40px"/>';
                        
                        if(row.S_FRONT_IMG_URL) var front_img_url = row.S_FRONT_IMG_URL;
                        else if(row.S_FRONT_IMG_URL_2) var front_img_url = row.S_FRONT_IMG_URL_2;
                        
                        
                        if(row.S_BACK_IMG_URL) var back_img_url = row.S_BACK_IMG_URL;
                        else if(row.S_BACK_IMG_URL_2) var back_img_url = row.S_BACK_IMG_URL_2;

                        if(row.N_BACK_VIEW == 0){
                            if(front_img_url) img1 = '<img src="'+front_img_url+'" style="max-width:40px;max-height:40px"/>';
                            if(back_img_url) img2 = '<img src="'+back_img_url+'" style="max-width:40px;max-height:40px"/>';
                        }
                        else{
                            if(front_img_url) img1 = '<img src="'+back_img_url+'" style="max-width:40px;max-height:40px"/>';
                            if(back_img_url) img2 = '<img src="'+front_img_url+'" style="max-width:40px;max-height:40px"/>';
                        }

                        var col_design = '<div class="design-img-table img-campaign-design" style="cursor:pointer;" campid="' + row.S_ID + '"><div class="design-img-cell">'+img1+'</div><div class="design-img-cell">'+img2+'</div></div>';

                        var camp_name = '<span class="campaign-label label-link" campid="' + row.S_ID + '">' + row.CAMPAIGN_NAME + '</span>';

                        var camp_id = '<span class="campid-label label-link">' + row.S_ID + '</span>';

                        var user_name = (row.USER_NAME)?row.USER_NAME+'<br>'+row.USER_EMAIL:row.USER_EMAIL
                        user_name = '<span class="affiliate-label label-link" userid="' + row.USER_ID + '">' + user_name + '</span>';

                        table2.row.add([camp_name,
                                        camp_id,
                                        user_name,
                                        col_design,
                                        (row.TOTAL_ORDER)?row.TOTAL_ORDER:0,
                                        'USD',
                                        (row.TOTAL_TRAFFIC)?row.TOTAL_TRAFFIC:0,
                                        conv_rate + '%',
                                        row.START_DATE,
                                        row.END_DATE]).draw( false );            
                    });
                }
            },
            error: function () {
                openModalError();
            }
        });
    }

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
                    var total = 0;
                    $.each(data.result, function(i,row){
                        visitorsData[row.S_COUNTRY_CODE] = row.COUNT_VISIT;
                        total += parseInt(row.COUNT_VISIT);
                    });
                    $.each(data.result2, function(i,row){
                        orderData[row.S_COUNTRY] = row.TOTAL_ORDER;
                    });
                    //World map by jvectormap
                    $('#world-map').html('');
                    $('#world-map').vectorMap({
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

                    //Progress bar
                    $('#traffic-overview-progress').html('');
                    $.each(data.result, function(i,row){
                        if(i < 4){
                            var percent = parseInt(row.COUNT_VISIT)/parseInt(total)*100;
                            var progress = '<div class="progress-group"><div class="process-y col-xs-3">' + row.S_COUNTRY + '</div>';
                            progress += '<div class="progress sm col-xs-9"><div class="progress-bar progress-bar-aqua" style="width: ' + percent + '%"></div></div></div>';
                            $('#traffic-overview-progress').append(progress);
                        }
                    });
                }
            },
            error: function () {
                openModalError();
            }
        });
    }

    function getOrderStatics(){
        $.ajax({
            url: backendurl,
            type: "GET",
            dataType: 'json',
            data: {
                cmd: 'getOrderStatics',
                start: date_start,
                end: date_end
            },
            success: function (data) {
                table_order_1.clear().draw();
                table_order_2.clear().draw();
                table_order_3.clear().draw();
                table_order_4.clear().draw();
                if(data && data.result1) {                         
                    $.each(data.result1, function(i,row){
                        table_order_1.row.add([
                            row.ORDER_DATE,
                            (row.S_NAME)?row.S_NAME+'<br>'+row.S_EMAIL:row.S_EMAIL,
                            row.TOTAL_QUANTITY,
                            '$'+row.TOTAL_AMOUNT]).draw( false );            
                    });
                }
                if(data && data.result2) {                         
                    $.each(data.result2, function(i,row){
                        table_order_2.row.add([
                            row.ORDER_DATE,
                            (row.S_NAME)?row.S_NAME+'<br>'+row.S_EMAIL:row.S_EMAIL,
                            row.TOTAL_QUANTITY,
                            '$'+row.TOTAL_AMOUNT]).draw( false );            
                    });
                }
                if(data && data.result3) {                         
                    $.each(data.result3, function(i,row){
                        table_order_3.row.add([
                            row.ORDER_DATE,
                            (row.S_NAME)?row.S_NAME+'<br>'+row.S_EMAIL:row.S_EMAIL,
                            row.TOTAL_QUANTITY,
                            '$'+row.TOTAL_AMOUNT]).draw( false );            
                    });
                }
                if(data && data.result4) { 
                    var date = date_start + ' - ' + date_end;
                    if($('#option-date').val() == 'today'){
                        date = 'Today';
                    }                        
                    $.each(data.result4, function(i,row){
                        table_order_4.row.add([
                            date,
                            row.CAMPAIGN_NAME,
                            row.COUNT_TRAFFIC]).draw( false );            
                    });
                }
            },
            error: function () {
                openModalError();
            }
        });
    }

    function getData(){
        getTopAffiliates();
        getTopCampaigns();
        getOverview();
        getTrafficOverview();
        getOrderStatics();
    }

    //ready function
    var table1 = $("#tb-top-affiliates").DataTable({
        'paging':   false,
        'ordering': false,
        'info':     false,
        'searching': false,
        "columnDefs": [
            { className: "table-col-design", "targets": [0] }
          ]
    });

    var table2 = $("#tb-top-campaigns").DataTable({
        'paging':   false,
        'ordering': false,
        'info':     false,
        'searching': false
    });

    var table_order_1 = $("#tb-recent-order").DataTable({
        'paging':   false,
        'ordering': false,
        'info':     false,
        'searching': false
    });
    var table_order_2 = $("#tb-best-celler").DataTable({
        'paging':   false,
        'ordering': false,
        'info':     false,
        'searching': false
    });
    var table_order_3 = $("#tb-less-celler").DataTable({
        'paging':   false,
        'ordering': false,
        'info':     false,
        'searching': false
    });
    var table_order_4 = $("#tb-most-viewed").DataTable({
        'paging':   false,
        'ordering': false,
        'info':     false,
        'searching': false
    });
    
    getData();

    $('#btn-affiliate-apply').on('click', function (e) {
        $('.dropdown-setting').removeClass('open');
        $.each($(".chk-col-affiliate"), function(i,item){
            if($(this).is(':checked')){
                table1.column($(this).attr('colnumb')).visible(true);
            }
            else{
                table1.column($(this).attr('colnumb')).visible(false);
            }
        });
    });

    $('#btn-campaign-apply').on('click', function (e) {
        $('.dropdown-setting').removeClass('open');
        $.each($(".chk-col-campaign"), function(i,item){
            if($(this).is(':checked')){
                table2.column($(this).attr('colnumb')).visible(true);
            }
            else{
                table2.column($(this).attr('colnumb')).visible(false);
            }
        });
    });

    $('#tb-top-affiliates').on('draw.dt', function() {
        $('.affiliate-label').off('click').on('click', function (e) {
            openModalAffiliate($(this).attr('userid'),date_start,date_end);
        });
    });

    $('#tb-top-campaigns').on('draw.dt', function() {
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