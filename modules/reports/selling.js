
(function ($, AdminLTE) {
    //get absolute path
    var loc = window.location;
    var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
    var absolutePath = loc.protocol + '//' + loc.host + pathName;
    //backend url
    var backendurl = absolutePath + 'modules/inc/reports.php';

    $('.select-box').selectctr();

    $('#btn-refresh').on( 'click', function () {
        getOrderSelling();
    });
    
    $("#btn-form-apply").on('click', function (e) {
        getOrderSelling();
        $('.dropdown-setting').removeClass('open');
    });

    $('#btn-refresh-2').on( 'click', function () {
        getRevenue();
    });

    $("#btn-form-apply-2").on('click', function (e) {
        getRevenue();
        $('.dropdown-setting').removeClass('open');
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

    function getOrderSelling(){
        $('#tb-order-loader').show();
        $.ajax({
            url: backendurl,
            type: "GET",
            dataType: 'json',
            data: {
                cmd: 'getOrderSelling',
                show_col_country: ($('#chk-col-country').is(':checked'))?1:0,
                show_col_city: ($('#chk-col-city').is(':checked'))?1:0,
                start: date_start,
                end: date_end
            },
            success: function (data) {
                $('#tb-order-loader').hide();
                table1.clear().draw();
                if(data && data.result) {   
                    var total_sale = 0;   
                    var revenue = 0;   
                    var total_traffic = 0;    

                    $.each(data.result, function(i,row){
                        var conv_rate = (row.TOTAL_ORDER && row.TOTAL_TRAFFIC)?round((parseFloat(row.TOTAL_ORDER)/parseFloat(row.TOTAL_TRAFFIC)*100),2):0;
                        table1.row.add([i+1,
                                        row.CREATE_DATE,
                                        (row.S_COUNTRY_CODE)?row.S_COUNTRY_CODE:'',
                                        (row.S_CITY)?row.S_CITY:'',
                                        (row.TOTAL_ORDER)?row.TOTAL_ORDER:0,
                                        (row.TOTAL_AMOUNT)?'$'+row.TOTAL_AMOUNT:'$0',
                                        (row.TOTAL_TRAFFIC)?row.TOTAL_TRAFFIC:0,
                                        conv_rate + '%']).draw( false );   
                        
                        if(row.TOTAL_ORDER) total_sale += parseInt(row.TOTAL_ORDER);
                        if(row.TOTAL_AMOUNT) revenue += parseFloat(row.TOTAL_AMOUNT);
                        if(row.TOTAL_TRAFFIC) total_traffic += parseInt(row.TOTAL_TRAFFIC);
                    });
                    if($('#chk-col-country').is(':checked')) table1.column(2).visible(true);
                    else table1.column(2).visible(false);
                    if($('#chk-col-city').is(':checked')) table1.column(3).visible(true);
                    else table1.column(3).visible(false);
                    $('#lb-total-sale').html(total_sale);
                    $('#lb-revenue').html('$' + round(revenue,2));
                    $('#lb-total-traffic').html(total_traffic);
                }
            },
            error: function () {
                openModalError();
            }
        });
    }

    function getRevenue(){
        $('#tb-revenue-loader').show();
        $.ajax({
            url: backendurl,
            type: "GET",
            dataType: 'json',
            data: {
                cmd: 'getRevenue',
                show_col_country: ($('#chk-col-country-2').is(':checked'))?1:0,
                show_col_city: ($('#chk-col-city-2').is(':checked'))?1:0,
                start: date_start,
                end: date_end
            },
            success: function (data) {
                $('#tb-revenue-loader').hide();
                table2.clear().draw();
                if(data && data.result) { 
                    var revenue = 0;   
                    var cost = 0;   
                    var net_revenue = 0;                        
                    $.each(data.result, function(i,row){
                        var net_revenue = (row.TOTAL_AMOUNT && row.TOTAL_COST)?round((parseFloat(row.TOTAL_AMOUNT) - parseFloat(row.TOTAL_COST)),2):0;
                        var net_revenue_2 = (row.TOTAL_AMOUNT_2 && row.TOTAL_COST_2)?round((parseFloat(row.TOTAL_AMOUNT_2) - parseFloat(row.TOTAL_COST_2)),2):0;
                        var change = 0;
                        if(net_revenue == 0 && net_revenue_2 == 0) change = 0;
                        else if(net_revenue_2 == 0) change = 100;
                        else change = round((net_revenue - net_revenue_2)/net_revenue_2*100,2);
                        table2.row.add([i+1,
                                        row.CREATE_DATE,
                                        (row.S_COUNTRY)?row.S_COUNTRY:'',
                                        (row.S_CITY)?row.S_CITY:'',
                                        (row.TOTAL_AMOUNT)?'$'+row.TOTAL_AMOUNT:'$0',
                                        (row.TOTAL_COST)?'$'+row.TOTAL_COST:'$0',
                                        (row.TOTAL_AMOUNT && row.TOTAL_COST)?'$'+round((parseFloat(row.TOTAL_AMOUNT) - parseFloat(row.TOTAL_COST)),2):'$0',
                                        (change >= 0)?'<span style="color:#03be5b">+' + change + '% UP</span>':'<span style="color:#d33131">'+change + '% DOWN</span>'
                                    ]).draw( false );   
                        
                        if(row.TOTAL_AMOUNT) revenue += parseFloat(row.TOTAL_AMOUNT);
                        if(row.TOTAL_COST) cost += parseFloat(row.TOTAL_COST);            
                    });
                    if($('#chk-col-country-2').is(':checked')) table2.column(2).visible(true);
                    else table2.column(2).visible(false);
                    if($('#chk-col-city-2').is(':checked')) table2.column(3).visible(true);
                    else table2.column(3).visible(false);
                    net_revenue = revenue - cost;
                    $('#lb-revenue').html('$' + round(revenue,2));
                    $('#lb-cost').html('$' + round(cost,2));
                    $('#lb-net-revenue').html('$' + round(net_revenue,2));
                }
            },
            error: function () {
                openModalError();
            }
        });
    }

    function getData(){
        getOverview();
        getOrderSelling();
        getRevenue();
    }

    //ready function
    var table1 = $("#tb-order").DataTable({
        'paging':   true,
        'ordering': false,
        'searching': false
    });
    var table2 = $("#tb-revenue").DataTable({
        'paging':   true,
        'ordering': false,
        'searching': false
    });
    getData();

})(jQuery, $.AdminLTE);