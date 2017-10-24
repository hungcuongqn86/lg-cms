
(function ($, AdminLTE) {
    //get absolute path
    var loc = window.location;
    var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
    var absolutePath = loc.protocol + '//' + loc.host + pathName;
    //backend url
    var backendurl = absolutePath + 'modules/inc/fulfillment.php';

    $('.select-box').selectctr();

    $('#btn-refresh-payment').on( 'click', function () {
        getPayment();
    });
    $('#btn-refresh-order-campaign').on( 'click', function () {
        getOrderCampaign();
    });
    $('#btn-refresh-order-product').on( 'click', function () {
        getOrderProduct();
    });
    $('#btn-refresh-campaign').on( 'click', function () {
        getCampaign();
    });
    $('#btn-refresh-product').on( 'click', function () {
        getProduct();
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

    function getPayment(){
        $("#tb-payment-loader").show();
        $.ajax({
            url: backendurl,
            type: "GET",
            dataType: 'json',
            data: {cmd: 'getHistoryPaymentData',
                startdate: date_start,
                enddate: date_end,
                state: $('#option-payment-state').val()
                },
            success: function (data) {
                $("#tb-payment-loader").hide();
                table1.clear().draw();
                if(data && data.result) {                         
                    $.each(data.result, function(i,row){
                        table1.row.add([row.CREATE_DATE,row.TOTAL_PAYMENT,'$'+row.TOTAL_AMOUNT]).draw( false );            
                    });
                }
                $("#lb-payment-total").html('$'+data.total_amount);
            },
            error: function () {
                openModalError();
            }
        });
    }

    function getOrderCampaign(){
        $("#tb-order-campaign-loader").show();
        $.ajax({
            url: backendurl,
            type: "GET",
            dataType: 'json',
            data: {cmd: 'getHistoryOrderCampaignData',
                startdate: date_start,
                enddate: date_end,
                state: $('#option-order-campaign-state').val()
                },
            success: function (data) {
                $("#tb-order-campaign-loader").hide();
                table2.clear().draw();
                if(data && data.result) {                         
                    $.each(data.result, function(i,row){
                        var detail_icon = '<a href="javascript:void(0)" class="i-campaign-detail"><i class="ion-information-circled" style="color:#fa9918;font-size:18px" title="Click to show details"></i></a>';
                        table2.row.add([row.CREATE_DATE,row.TOTAL_ORDER_CAMPAIGN,row.TOTAL_QUANTITY, '$'+row.TOTAL_AMOUNT, detail_icon]).draw( false );             
                    });
                }
                $("#lb-order-campaign-total-quantity").html(data.total_quantity);
                $("#lb-order-campaign-total-amount").html('$'+data.total_amount);
            },
            error: function () {
                openModalError();
            }
        });
    }

    function getOrderProduct(){
        $("#tb-order-product-loader").show();
        $.ajax({
            url: backendurl,
            type: "GET",
            dataType: 'json',
            data: {cmd: 'getHistoryOrderProductData',
                startdate: date_start,
                enddate: date_end,
                state: $('#option-order-product-state').val()
                },
            success: function (data) {
                $("#tb-order-product-loader").hide();
                table3.clear().draw();
                if(data && data.result) {                         
                    $.each(data.result, function(i,row){
                        var detail_icon = '<a href="javascript:void(0)" class="i-product-detail"><i class="ion-information-circled" style="color:#fa9918;font-size:18px" title="Click to show details"></i></a>';
                        table3.row.add([row.CREATE_DATE,row.TOTAL_ORDER_PRODUCT,row.TOTAL_QUANTITY,'$'+row.TOTAL_AMOUNT, detail_icon]).draw( false );            
                    });
                }
                $("#lb-order-product-total-quantity").html(data.total_quantity);
                $("#lb-order-product-total-amount").html('$'+data.total_amount);
            },
            error: function () {
                openModalError();
            }
        });
    }

    function getCampaign(){
        $("#tb-campaign-loader").show();
        $.ajax({
            url: backendurl,
            type: "GET",
            dataType: 'json',
            data: {cmd: 'getHistoryCampaignData',
                startdate: date_start,
                enddate: date_end,
                state: $('#option-campaign-state').val()
                },
            success: function (data) {
                $("#tb-campaign-loader").hide();
                table4.clear().draw();
                if(data && data.result) {                         
                    $.each(data.result, function(i,row){
                        table4.row.add([row.CREATE_DATE,row.TOTAL_CAMPAIGN]).draw( false );          
                    });
                }
                $("#lb-campaign-total").html(data.total_campaign);
            },
            error: function () {
                openModalError();
            }
        });
    }

    function getProduct(){
        $("#tb-product-loader").show();
        $.ajax({
            url: backendurl,
            type: "GET",
            dataType: 'json',
            data: {cmd: 'getHistoryProductData',
                startdate: date_start,
                enddate: date_end,
                state: $('#option-product-state').val()
                },
            success: function (data) {
                $("#tb-product-loader").hide();
                table5.clear().draw();
                if(data && data.result) {                         
                    $.each(data.result, function(i,row){
                        table5.row.add([row.CREATE_DATE,row.TOTAL_PRODUCT]).draw( false );          
                    });
                }
                $("#lb-product-total").html(data.total_product);
            },
            error: function () {
                openModalError();
            }
        });
    }

    var chk_load_prod_detail = 0;
    var date_prod_detail = '';
    //func get detail data
    function getProductDetailData(){
        $('#tb-product-detail-loader').show();
        if(chk_load_prod_detail == 0){
            chk_load_prod_detail = 1;
            $("#tb-product-detail").DataTable({
                'columnDefs': [
                    {'targets': 2,
                        'data': null,
                        'render': function ( data, type, full, meta ) {
                            var amount = '$'+data.PRODUCT_AMOUNT;
                            return amount;
                        }
                    }
                ],
                'processing': true,
                'serverSide': true,
                'ajax': {
                    url: backendurl + "?cmd=getOrderProductDetailData",
                    data: function ( d ) {
                        d.date = date_prod_detail;
                        d.state = $('#option-order-product-state').val();
                    },
                    error: function () {
                        openModalError();
                    }
                },
                "columns": [
                    { "data": "S_NAME" },
                    { "data": "PRODUCT_QUANTITY" },
                    { "data": null }
                ],
                "fnDrawCallback" : function() {
                    $('#tb-product-detail-loader').hide();
                },
                processing: false
            });
        }
        else{
            $("#tb-product-detail").DataTable().ajax.reload();
        }
    }

    var chk_load_campaign_detail = 0;
    var date_campaign_detail = '';
    //func get detail data
    function getCampaignDetailData(){
        $('#tb-campaign-detail-loader').show();
        if(chk_load_campaign_detail == 0){
            chk_load_campaign_detail = 1;
            $("#tb-campaign-detail").DataTable({
                'columnDefs': [
                    {'targets': 2,
                        'data': null,
                        'render': function ( data, type, full, meta ) {
                            var amount = '$'+data.CAMPAIGN_AMOUNT;
                            return amount;
                        }
                    }
                ],
                'processing': true,
                'serverSide': true,
                'ajax': {
                    url: backendurl + "?cmd=getOrderCampaignDetailData",
                    data: function ( d ) {
                        d.date = date_campaign_detail;
                        d.state = $('#option-order-campaign-state').val();
                    },
                    error: function () {
                        openModalError();
                    }
                },
                "columns": [
                    { "data": "S_TITLE" },
                    { "data": "CAMPAIGN_QUANTITY" },
                    { "data": null }
                ],
                "fnDrawCallback" : function() {
                    $('#tb-campaign-detail-loader').hide();
                },
                processing: false
            });
        }
        else{
            $("#tb-campaign-detail").DataTable().ajax.reload();
        }
    }

    function getData(){
        getPayment();
        getOrderCampaign();
        getOrderProduct();
        getCampaign();
        getProduct();
    }

    //ready function
    var table1 = $("#tb-payment").DataTable({
        'paging':   false,
        'ordering': false,
        'info':     false,
        'searching': false
    });
    var table2 = $("#tb-order-campaign").DataTable({
        'paging':   false,
        'ordering': false,
        'info':     false,
        'searching': false
    });
    var table3 = $("#tb-order-product").DataTable({
        'paging':   false,
        'ordering': false,
        'info':     false,
        'searching': false
    });
    var table4 = $("#tb-campaign").DataTable({
        'paging':   false,
        'ordering': false,
        'info':     false,
        'searching': false
    });
    var table5 = $("#tb-product").DataTable({
        'paging':   false,
        'ordering': false,
        'info':     false,
        'searching': false
    });
    getData();

    $('#tb-order-product').on('draw.dt', function() {
        $('.i-product-detail').off('click').on('click', function (e) {
            date_prod_detail = table3.row(this.closest('tr')).data()[0];
            $('#date-product-detail').html(date_prod_detail);
            $('#modal-product-detail').modal('show');
            $('#modal-product-detail').each(reposition);
            getProductDetailData();
        });
    });

    $('#tb-order-campaign').on('draw.dt', function() {
        $('.i-campaign-detail').off('click').on('click', function (e) {
            date_campaign_detail = table2.row(this.closest('tr')).data()[0];
            $('#date-campaign-detail').html(date_campaign_detail);
            $('#modal-campaign-detail').modal('show');
            $('#modal-campaign-detail').each(reposition);
            getCampaignDetailData();
        });
    });

})(jQuery, $.AdminLTE);