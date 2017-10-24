//get absolute path
var loc = window.location;
var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
var absolutePath = loc.protocol + '//' + loc.host + pathName;
//backend url
var printingbackendurl = absolutePath + 'portals/modules/inc/printing.php';

var prod_printing_id = null;

//function open dialog
function openModalPrinting(id,tab_select){
    $('#modal-printing').modal('show');
    $('#modal-printing').each(reposition);
    $('.nav-tabs a[href="#'+tab_select+'"]').tab('show');

    prod_printing_id = id;
    getModalPrinting();
}

function getModalPrinting(){
    $('#modal-printing-loader').show();
    $('.accept-form').hide();
    $('#modal-printing-state-option').next('.select-control').hide();
    $('#modal-form-btn-save-state').hide();
    $.ajax({
        url: printingbackendurl,
        type: "GET",
        dataType: 'json',
        data: {cmd: 'getProductPrintingInfo',
               id: prod_printing_id},
        success: function (data) {
            if(data && data.result) {
                $('#modal-printing-name').html(data.result.S_PRODUCT_NAME);

                var state = data.result.S_STATE;
                if(data.result.S_STATE == 'created') state = 'Received';
                if(data.result.S_STATE == 'printed') state = 'Printed';
                if(data.result.S_STATE == 'reject') state = 'Rejected';
                if(data.result.S_STATE == 'deny') state = 'Deny';
                if(data.result.S_STATE == 'approved') state = 'Done';

                $('#modal-printing-state').html(state);
                $('#modal-printing-size').html(data.result.S_SIZE);
                $('#modal-printing-color').html(data.result.S_COLOR);
                $('#modal-printing-quantity').html(data.result.N_QUANTITY);

                if($.trim(data.result.S_PRODUCT_FRONT_IMG_URL)){
                    $('#modal-printing-img-1').attr('src',data.result.S_PRODUCT_FRONT_IMG_URL);
                    $('#modal-printing-img-1').show();
                }
                else{
                    $('#modal-printing-img-1').hide();
                }

                if($.trim(data.result.S_PRODUCT_BACK_IMG_URL)){
                    $('#modal-printing-img-2').attr('src',data.result.S_PRODUCT_BACK_IMG_URL);
                    $('#modal-printing-img-2').show();
                }
                else{
                    $('#modal-printing-img-2').hide();
                }

                if(data.result.S_STATE == 'created' || data.result.S_STATE == 'reject'){
                    $('.accept-form').show();
                    $("#txt-form-info-s").focus();
                }
                else{
                    $('.accept-form').hide();
                }
                if(data.result.S_STATE == 'printing'){
                    $('#modal-printing-state').hide();
                    $('#modal-printing-state-option').next('.select-control').show();
                    $('#modal-form-btn-save-state').show();
                }
                else{
                    $('#modal-printing-state').show();
                    $('#modal-printing-state-option').next('.select-control').hide();
                    $('#modal-form-btn-save-state').hide();
                }

                if(data.result.S_FRONT_IMAGE_URL){
                    $('#printing-design-front').show();
                    $('#div-modal-printing-design-img-1').show();
                    $('#modal-printing-front-width').html(data.result.S_FRONT_IMAGE_WIDTH);
                    $('#modal-printing-front-height').html(data.result.S_FRONT_IMAGE_HEIGHT);
                    $('#modal-printable-front-top').html(data.result.S_FRONT_PRINTABLE_TOP);
                    $('#modal-printable-front-left').html(data.result.S_FRONT_PRINTABLE_LEFT);
                    $('#modal-printable-front-width').html(data.result.S_FRONT_PRINTABLE_WIDTH);
                    $('#modal-printable-front-height').html(data.result.S_FRONT_PRINTABLE_HEIGHT);
                    $('#modal-printing-design-img-1').attr('src',data.result.S_FRONT_IMAGE_URL);

                    $("#a-design-front").attr("href",data.result.S_FRONT_IMAGE_URL);
                    $("#a-design-front").attr("download",data.result.S_PRODUCT_NAME);

                    $.ajax({
                        url:data.result.S_FRONT_IMAGE_URL.replace(".png", ".eps"),
                        type:'HEAD',
                        complete: function(xhr, textStatus) {
                            if(xhr.status == 200){
                                $("#a-design-front-eps").attr("href",data.result.S_FRONT_IMAGE_URL.replace(".png", ".eps"));
                                $("#a-design-front-eps").attr("download",data.result.S_FRONT_IMAGE_URL.replace(".png", ".eps"));
                                $("#a-design-front-eps").show();
                            }
                            else{
                                $("#a-design-front-eps").hide();
                            }
                        }
                    });
                }
                else{
                    $('#printing-design-front').hide();
                    $('#div-modal-printing-design-img-1').hide();
                }
                if(data.result.S_BACK_IMAGE_URL){
                    $('#printing-design-back').show();
                    $('#div-modal-printing-design-img-2').show();
                    $('#modal-printing-back-width').html(data.result.S_BACK_IMAGE_WIDTH);
                    $('#modal-printing-back-height').html(data.result.S_BACK_IMAGE_HEIGHT);
                    $('#modal-printable-back-top').html(data.result.S_BACK_PRINTABLE_TOP);
                    $('#modal-printable-back-left').html(data.result.S_BACK_PRINTABLE_LEFT);
                    $('#modal-printable-back-width').html(data.result.S_BACK_PRINTABLE_WIDTH);
                    $('#modal-printable-back-height').html(data.result.S_BACK_PRINTABLE_HEIGHT);
                    $('#modal-printing-design-img-2').attr('src',data.result.S_BACK_IMAGE_URL);

                    $("#a-design-back").attr("href",data.result.S_BACK_IMAGE_URL);
                    $("#a-design-back").attr("download",data.result.S_PRODUCT_NAME);

                    $.ajax({
                        url:data.result.S_BACK_IMAGE_URL.replace(".png", ".eps"),
                        type:'HEAD',
                        complete: function(xhr, textStatus) {
                            if(xhr.status == 200){
                                $("#a-design-back-eps").attr("href",data.result.S_BACK_IMAGE_URL.replace(".png", ".eps"));
                                $("#a-design-back-eps").attr("download",data.result.S_BACK_IMAGE_URL.replace(".png", ".eps"));
                                $("#a-design-back-eps").show();
                            }
                            else{
                                $("#a-design-back-eps").hide();
                            }
                        }
                    });
                }
                else{
                    $('#printing-design-back').hide();
                    $('#div-modal-printing-design-img-2').hide();
                }

                $('#modal-printing-shipping-name').html(data.result.S_SHIPPING_NAME);
                $('#modal-printing-shipping-email').html(data.result.S_SHIPPING_EMAIL);
                $('#modal-printing-shipping-phone').html(data.result.S_SHIPPING_PHONE);
                $('#modal-printing-shipping-line1').html(data.result.S_SHIPPING_LINE1);
                $('#modal-printing-shipping-line2').html(data.result.S_SHIPPING_LINE2);
                $('#modal-printing-shipping-city').html(data.result.S_SHIPPING_CITY);
                $('#modal-printing-shipping-state').html(data.result.S_SHIPPING_STATE);
                $('#modal-printing-shipping-postalcode').html(data.result.S_SHIPPING_POSTAL_CODE);
                $('#modal-printing-shipping-country').html(data.result.S_SHIPPING_COUNTRY_CODE);

                if(data.result.N_SHIPPING_AS_GIFT == 0){
                    $('#modal-printing-shipping-as-gift').html('<span style="color:#d33131">NO</span>');
                }
                else{
                    $('#modal-printing-shipping-as-gift').html('<span style="color:#03be5b">YES</span>');
                }
            }
            $('#modal-printing-loader').hide();
        },
        error: function () {
            openModalError();
        }
    });
}

//func save data
function updateState(state){
    $('#modal-printing-loader').show();
    $.ajax({
        url: printingbackendurl,
        type: "POST", //GET, POST, PUT, DELETE
        dataType: 'json',
        //contentType: 'application/json',
        data: {cmd: 'saveProductPrintingData',
               id: prod_printing_id,
               state: (state)?state:$("#modal-printing-state-option").val()
              },
        success: function (data) {
            $('#modal-printing-loader').hide();
            if(data && data.result) {
                getModalPrinting();
                $("#tb-form").DataTable().ajax.reload();
            }
        },
        error: function () {
            openModalError();
        }
    });
}

//func print data
function _acceptData(){
    $('#modal-printing-loader').show();
    $.ajax({
        url: printingbackendurl,
        type: "POST",
        dataType: 'json',
        data: {cmd: 'acceptProductPrintData',
               prod_print_arr: [prod_printing_id],
               info: $("#txt-form-info-s").val()
              },
        success: function (data) {
            $('#modal-printing-loader').hide();
            if(data && data.result) {
                getModalPrinting();
                $("#tb-form").DataTable().ajax.reload();
            }
        },
        error: function () {
            openModalError();
        }
    });
}

(function ($, AdminLTE) {
    $(document).ready(function(){
        $('#btn-accept-s').on('click', function (e) {
            _acceptData();
        });

        $('#btn-deny-s').on('click', function (e) {
            updateState('deny');
        });

        $('#modal-btn-save-state').on('click', function (e) {
            updateState();
        });
    });
})(jQuery, $.AdminLTE);