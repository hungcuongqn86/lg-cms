//get absolute path
var loc = window.location;
var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
var absolutePath = loc.protocol + '//' + loc.host + pathName;
//backend url
var backendurl = absolutePath + 'modules/inc/modal.php';

var table_affiliate_campaign = null;

var affiliate_id = null;
var arriliate_date_start = null;
var arriliate_date_end = null;

//function open dialog
function openModalAffiliate(userid,date_start,date_end){
    $('#modal-affiliate').modal('show');
    $('#modal-affiliate').each(reposition);
    arriliate_date_start = date_start;
    arriliate_date_end = date_end;

    affiliate_id = userid;
    getModalAffiliate();
    getModalAffiliateCampaign();
    getModalAffiliateSparkLine();
}

function round(value, decimals) {
    if(!decimals) decimals = 0;
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

function getModalAffiliate(){
    $('#modal-affiliate-loader').show();
    $.ajax({
        url: backendurl,
        type: "GET",
        dataType: 'json',
        data: {
            cmd: 'getAffiliateData',
            id: affiliate_id
        },
        success: function (data) {
            $('#modal-affiliate-loader').hide();
            if(data && data.result) {
                $("#affiliate-name").html(data.result.S_NAME);
                $("#affiliate-home-username").html(data.result.S_NAME);
                $("#affiliate-home-userid").html(affiliate_id);

                $("#affiliate-home-info-name").html(data.result.S_NAME);
                $("#affiliate-home-info-street").html(data.result.S_ADDR_LINE1);
                $("#affiliate-home-info-street-2").html(data.result.S_ADDR_LINE2);
                $("#affiliate-home-info-city").html(data.result.S_ADDR_CITY);
                $("#affiliate-home-info-state").html(data.result.STATE_NAME);
                $("#affiliate-home-info-zipcode").html(data.result.S_ADDR_POS_CODE);
                $("#affiliate-home-info-country").html(data.result.COUNTRY_NAME);

                $("#affiliate-home-pixel-fb").html(data.result.S_FB_PIXEL);
                $("#affiliate-home-pixel-gg").html(data.result.S_GG_MANAGER);
            }
            if(data &&data.state){
                $("#affiliate-home-info-status").selectval(data.state);
                $("#affiliate-status").html($("#affiliate-home-info-status").find("option:selected").text());
            }
            if(data && data.result_payment){
                $("#affiliate-home-billing-paypal-email").html(data.result_payment.S_PAYPAL_EMAIL);
                $("#affiliate-home-billing-paypal-firstname").html(data.result_payment.S_PAYPAL_FIRSTNAME);
                $("#affiliate-home-billing-paypal-lastname").html(data.result_payment.S_PAYPAL_LASTNAME);

                $("#affiliate-home-billing-payoneer-email").html(data.result_payment.S_PAYONEER_EMAIL);

                $("#affiliate-home-billing-wiretransfer-accountname").html(data.result_payment.S_WIRE_ACCOUNT_NAME);
                $("#affiliate-home-billing-wiretransfer-accountnumb").html(data.result_payment.S_WIRE_ACCOUNT_NUMBER);
                $("#affiliate-home-billing-wiretransfer-country").html(data.result_payment.S_WIRE_COUNTRY);
                $("#affiliate-home-billing-wiretransfer-routingnumb").html(data.result_payment.S_WIRE_ROUTING_NUMBER);
            }
        },
        error: function () {
            openModalError();
        }
    });
}

function getModalAffiliateSparkLine(){
    $.ajax({
        url: backendurl,
        type: "GET",
        dataType: 'json',
        data: {cmd: 'getAffiliateOrder',
               id: affiliate_id,
               start: arriliate_date_start,
               end: arriliate_date_end
              },
        success: function (data) {
            if(data.result){
                var chart_data = [];
                $.each(data.result, function(i,row){
                    var total_sale = (row.TOTAL_SALE)?parseInt(row.TOTAL_SALE):0;
                    chart_data.push(total_sale);
                });

                //Sparkline
                $('#affiliate-order-chart').highcharts('SparkLine', {
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
            }
        },
        error: function () {
            openModalError();
        }
    });
}

function getModalAffiliateCampaign(){
    $('#tb-affiliate-campaign-loader').show();
    if(!table_affiliate_campaign){
        table_affiliate_campaign = $("#tb-affiliate-campaign").DataTable({
            'paging':   true,
            'ordering': false,
            'searching': false
        });
    }
    $.ajax({
        url: backendurl,
        type: "GET",
        dataType: 'json',
        data: {
            cmd: 'getAffiliateCampaign',
            id: affiliate_id,
            start: arriliate_date_start,
            end: arriliate_date_end
        },
        success: function (data) {
            $('#tb-affiliate-campaign-loader').hide();
            table_affiliate_campaign.clear().draw();
            $("#affiliate-home-total-campaign").html(0);
            if(data && data.result) { 
                $("#affiliate-home-total-campaign").html(data.result.length);                        
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

                    var col_design = '<div class="design-img-table"><div class="design-img-cell">'+img1+'</div><div class="design-img-cell">'+img2+'</div></div>';

                    table_affiliate_campaign.row.add([
                        (row.CAMPAIGN_NAME)?row.CAMPAIGN_NAME:'',
                        row.S_ID,
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

function saveAffiliateStatus(){
    $('#modal-affiliate-loader').show();
    $.ajax({
        url: backendurl,
        type: "POST",
        dataType: 'json',
        data: {cmd: 'updateAffiliateStatus',
               id: affiliate_id,
               state: $("#affiliate-home-info-status").val()
              },
        success: function (data) {
            if(data && data.result) {
                $("#affiliate-status").html($("#affiliate-home-info-status").find("option:selected").text());
            }
            
            $('#modal-affiliate-loader').hide();
        },
        error: function () {
            openModalError();
        }
    });
}

(function ($, AdminLTE) {
    $(document).ready(function(){
        $('#btn-affiliate-campaign-apply').on('click', function (e) {
            $('.dropdown-setting').removeClass('open');
            $.each($(".chk-col-affiliate-campaign"), function(i,item){
                if($(this).is(':checked')){
                    table_affiliate_campaign.column($(this).attr('colnumb')).visible(true);
                }
                else{
                    table_affiliate_campaign.column($(this).attr('colnumb')).visible(false);
                }
            });
        });
        $('#btn-affiliate-home-save').on('click', function (e) {
            saveAffiliateStatus();
        });
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
    });
})(jQuery, $.AdminLTE);