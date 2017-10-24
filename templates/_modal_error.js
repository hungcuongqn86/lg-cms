
//function open dialog
function openModalError(){
    $('#modal-error').modal('show');
    $('#modal-error').each(reposition);
}

function reposition() {
    var modal = $(this),
        dialog = modal.find('.modal-dialog');
    modal.css('display', 'block');
    
    dialog.css("margin-top", Math.max(0, ($(window).height() - dialog.height()) / 2));
}

(function ($, AdminLTE) {
    $(document).ready(function(){
        $('#btn-modal-error-reload').on( 'click', function () {
            window.location.reload();
        });
        
        // Reposition when the window is resized
        $(window).on('resize', function() {
            $('.modal:visible').each(reposition);
        });
    });
    
})(jQuery, $.AdminLTE);
