
(function ($, AdminLTE) {
    //get absolute path
    var loc = window.location;
    var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
    var absolutePath = loc.protocol + '//' + loc.host + pathName;
    //backend url
    var backendurl = absolutePath + 'modules/inc/setup.php';

    $('.select-box').selectctr();

    $('#btn-refresh').on( 'click', function () {
        getData();
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

    function getData(){
        $('#tb-form-loader').show();
        table1.ajax.reload();
    }

    //ready function
    var table1 = $("#tb-form").DataTable({
        'aaSorting': [[0, 'desc']],
        'processing': true,
        'serverSide': true,
        'ajax':{
            url: backendurl + "?cmd=getLogData",
            data: function ( d ) {
                d.startdate = date_start;
                d.enddate = date_end;
            },
            error: function () {
                openModalError();
            }
        },
        'columns': [
            { "data": 'DD_CREATE' },
            { "data": 'USER_NAME' },
            { "data": 'S_IP' },
            { "data": 'S_ACTION' },
            { "data": 'S_URI' },
            { "data": 'S_DESC' }
        ],
        "fnDrawCallback" : function() {
            $('#tb-form-loader').hide();
        },
        processing: false
    });

    $('#btn-form-apply').on('click', function (e) {
        $('.dropdown-setting').removeClass('open');
        $.each($(".chk-col-tb"), function(i,item){
            if($(this).is(':checked')){
                $("#tb-form").DataTable().column($(this).attr('colnumb')).visible(true);
            }
            else{
                $("#tb-form").DataTable().column($(this).attr('colnumb')).visible(false);
            }
        });
    });

})(jQuery, $.AdminLTE);