//get absolute path
var loc = window.location;
var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
var absolutePath = loc.protocol + '//' + loc.host + pathName;
//backend url
var backendurl = absolutePath + 'modules/inc/modal.php';

var table_customer = null;

var campaign_id = null;
var customer_date_start = null;
var customer_date_end = null;

//function open dialog
function openModalCustomer(campid,date_start,date_end){
    $('#modal-customer').modal('show');
    $('#modal-customer').each(reposition);
    customer_date_start = date_start;
    customer_date_end = date_end;

    campaign_id = campid;
    getModalCustomerCampaignInfo();
    getModalCustomer();
}

function round(value, decimals) {
    if(!decimals) decimals = 0;
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

function getModalCustomerCampaignInfo(){
    $.ajax({
        url: backendurl,
        type: "GET",
        dataType: 'json',
        data: {cmd: 'getCampaignInfo',
               id: campaign_id},
        success: function (data) {
            if(data && data.result) {
                $("#modal-campaign-name").html(data.result.S_TITLE);
                var state = data.result.S_STATE;
                if(state == 'approved') state = 'Approved';
                if(state == 'launching') state = 'Launching';
                if(state == 'end') state = 'Ended';
                if(state == 'locked') state = 'Locked';
                if(state == 'deleted') state = 'Deleted';
                $("#modal-campaign-status").html(state);
            }
        },
        error: function () {
            openModalError();
        }
    });
}

function getModalCustomer(){
    $('#tb-customer-loader').show();
    if(!table_customer){
        table_customer = $("#tb-customer").DataTable({
            'columnDefs': [
                {'targets': 0, 'orderable': false,
                    'data': null,
                    'render': function ( data, type, full, meta ) {
                        var shipping_name = data.SHIPPING_EMAIL;
                        if(data.SHIPPING_NAME) shipping_name = data.SHIPPING_NAME + '<br>' + data.SHIPPING_EMAIL;
                        return shipping_name;
                    }
                },
                {'targets': 2, 'orderable': false,
                    'data': null,
                    'render': function ( data, type, full, meta ) {
                        //Get design image
                        var img1 = '<img src="'+absolutePath+'resource/image/default.png" style="max-width:40px;max-height:40px"/>';
                        var img2 = '<img src="'+absolutePath+'resource/image/default.png" style="max-width:40px;max-height:40px"/>';
                        
                        if(data.S_FRONT_IMG_URL) var front_img_url = data.S_FRONT_IMG_URL;
                        if(data.S_BACK_IMG_URL) var back_img_url = data.S_BACK_IMG_URL;

                        if(data.N_BACK_VIEW == 0){
                            if(front_img_url) img1 = '<img src="'+front_img_url+'" style="max-width:40px;max-height:40px"/>';
                            if(back_img_url) img2 = '<img src="'+back_img_url+'" style="max-width:40px;max-height:40px"/>';
                        }
                        else{
                            if(front_img_url) img1 = '<img src="'+back_img_url+'" style="max-width:40px;max-height:40px"/>';
                            if(back_img_url) img2 = '<img src="'+front_img_url+'" style="max-width:40px;max-height:40px"/>';
                        }

                        var col_design = '<div class="design-img-table"><div class="design-img-cell">'+img1+'</div><div class="design-img-cell">'+img2+'</div></div>';
                        return col_design;
                    }
                },
                {'targets': 3, 'orderable': false,
                    'data': null,
                    'render': function ( data, type, full, meta ) {
                        return 'USD';
                    }
                },
                {'targets': 4,
                    'data': null,
                    'render': function ( data, type, full, meta ) {
                        var total_quantity = (data.TOTAL_QUANTITY)?data.TOTAL_QUANTITY:0;
                        return total_quantity;
                    }
                },
                {'targets': 5,
                    'data': null,
                    'render': function ( data, type, full, meta ) {
                        var revenue = (data.REVENUE)?'$'+data.REVENUE:'$0';
                        return revenue;
                    }
                }
            ],
            'aaSorting': [[4, 'desc']],
            'processing': true,
            'serverSide': true,
            'ajax': {
                url: backendurl + "?cmd=getCustomerData",
                data: function ( d ) {
                    d.campid = campaign_id;
                    d.startdate = customer_date_start;
                    d.enddate = customer_date_end;
                },
                error: function () {
                    openModalError();
                }
            },
            "columns": [
                { "data": null },
                { "data": 'S_ID' },
                { "data": null },
                { "data": null },
                { "data": null },
                { "data": null },
                { "data": 'CREATE_DATE' }
            ],
            "fnDrawCallback" : function() {
                $('#tb-customer-loader').hide();
            },
            processing: false
        });
    }
    else{
        table_customer.ajax.reload();
    }
}

(function ($, AdminLTE) {
    $(document).ready(function(){
        $('#btn-modal-customer-apply').on('click', function (e) {
            $('.dropdown-setting').removeClass('open');
            $.each($(".chk-col-modal-customer"), function(i,item){
                if($(this).is(':checked')){
                    table_customer.column($(this).attr('colnumb')).visible(true);
                }
                else{
                    table_customer.column($(this).attr('colnumb')).visible(false);
                }
            });
        });
    });
})(jQuery, $.AdminLTE);