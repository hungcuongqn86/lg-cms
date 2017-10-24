//get absolute path
var loc = window.location;
var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
var absolutePath = loc.protocol + '//' + loc.host + pathName;
//backend url
var backendurl = absolutePath + 'modules/inc/modal.php';

//function open dialog
function openModalChangePw(){
    $('#modal-change-password').modal('show');
    $('#modal-change-password').each(reposition);
}

function reposition() {
    var modal = $(this),
        dialog = modal.find('.modal-dialog');
    modal.css('display', 'block');
    
    dialog.css("margin-top", Math.max(0, ($(window).height() - dialog.height()) / 2));
}

//func change password
function changePassword(){
    $("#loader-modal-change-pw").show();
    $("#btn-modal-change-pw").addClass("disabled");
    $.ajax({
        url: backendurl,
        type: "POST", //GET, POST, PUT, DELETE
        dataType: 'json',
        //contentType: 'application/json',
        data: {cmd: 'changePassword',
               curr_pw: $("#txt-form-current-pw").val(),
               new_pw: $("#txt-form-new-pw").val(),
               new_pw_2: $("#txt-form-new-pw-2").val()
              },
        success: function (data) {
            $("#btn-modal-change-pw").removeClass("disabled");
            if(data && data.error){
                $("#p-error-change-pw").html(data.error);
                $("#p-error-change-pw").show();
            }
            else{
                $("#p-error-change-pw").hide();
                $('#modal-change-password').modal('hide');
                $("#modal-change-password-finish").modal('show');
                $('#modal-change-password-finish').each(reposition);
            }
            $("#loader-modal-change-pw").hide();
        },
        error: function () {
            openModalError();
        }
    });
}

(function ($, AdminLTE) {
    $(document).ready(function(){
        $('.btn-change-pw').on( 'click', function () {
            $("#p-error-change-pw").hide();
            $('#txt-form-current-pw').val('');
            $('#txt-form-new-pw').val('');
            $('#txt-form-new-pw-2').val('');
            openModalChangePw();
            $('#txt-form-current-pw').focus();
        });

        $("#btn-modal-change-pw").on('click', function (e) {
            if(!$(this).hasClass('disabled'))
            changePassword();
        });
        
        // Reposition when the window is resized
        $(window).on('resize', function() {
            $('.modal:visible').each(reposition);
        });

        $('.slick-nav').slick({
            arrows: false,
            dots: false,
            slidesToShow: 8,
            slidesToScroll: 8,
            responsive: [
                {
                    breakpoint: 1025,
                    settings: {
                        arrows: false,
                        slidesToShow: 6,
                        slidesToScroll: 6
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        arrows: false,
                        slidesToShow: 2,
                        slidesToScroll: 2
                    }
                }
            ]
        });
    });
})(jQuery, $.AdminLTE);