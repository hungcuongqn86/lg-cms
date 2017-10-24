
(function ($, AdminLTE) {
    //get absolute path
    var loc = window.location;
    var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
    var absolutePath = loc.protocol + '//' + loc.host + pathName;
    //backend url
    var backendurl = absolutePath + 'portals/modules/inc/printing.php';

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
        getCountProductPrinting();
    });

    $('#option-state').on( 'change', function () {
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
        getCountProductPrinting();
    });

    function round(value, decimals) {
        if(!decimals) decimals = 0;
        return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
    }

    function getCountProductPrinting(){
        $.ajax({
            url: backendurl,
            type: "GET",
            dataType: 'json',
            data: {
                cmd: 'getCountProductPrinting',
                start: date_start,
                end: date_end
            },
            success: function (data) {
                $('#p-count-received').html(0);
                $('#p-count-printing').html(0);
                $('#p-count-printed').html(0);
                $('#p-count-approved').html(0);
                if(data && data.result) {
                    $.each(data.result, function(i,row){
                        if(row.S_STATE == 'created'){
                            $('#p-count-received').html(row.COUNT_ITEM);
                        }
                        if(row.S_STATE == 'printing'){
                            $('#p-count-printing').html(row.COUNT_ITEM);
                        }
                        if(row.S_STATE == 'printed'){
                            $('#p-count-printed').html(row.COUNT_ITEM);
                        }
                        if(row.S_STATE == 'approved'){
                            $('#p-count-done').html(row.COUNT_ITEM);
                        }
                    });
                }
            },
            error: function () {
                openModalError();
            }
        });
    }

    //func print data
    function acceptData(){
        var prod_print_arr = [];
        $.each($(".chk-prod-printing"), function(i,item){
            if($(this).is(':checked')){
                var prod_print_id = table1.row($(this).closest('tr')).data().S_ID;
                prod_print_arr.push(prod_print_id);
            }
        });

        if(!prod_print_arr.length){
            $("#p-accept-problem").show();
             return;
        }
        else{
            $("#p-accept-problem").hide();
        }
        $('#form-loader').show();
        $.ajax({
            url: backendurl,
            type: "POST", //GET, POST, PUT, DELETE
            dataType: 'json',
            //contentType: 'application/json',
            data: {cmd: 'acceptProductPrintData',
                   prod_print_arr: prod_print_arr,
                   info: $("#txt-form-info").val()
                  },
            success: function (data) {
                if(data && data.result) {
                    $('#option-state').selectval('created');
                    table1.ajax.reload();
                }
            },
            error: function () {
                openModalError();
            }
        });
    }

    
    //func get data
    function getData(){
        $("#div-form-accept").hide();
        table1.column(0).visible(false);
        $('#tb-form-loader').show();
        table1.ajax.reload();
    }

    //ready function
    var table1 = $("#tb-form").DataTable({
        'columnDefs': [
            {'targets': 0, 'orderable': false, "visible": false,
                'defaultContent': '<div class="checkbox icheck checkbox-warning"><input type="checkbox" class="chk-prod-printing"><label></label></div>'
            },
            {'targets': 1,
                'data': null,
                'render': function ( data, type, full, meta ) {
                var state = '';
                if(data.S_STATE == 'created') state = '<div class="color-list"><div class="color color-status" style="background-color:#03be5b"></div>Received</div>';
                if(data.S_STATE == 'printing') state = '<div class="color-list"><div class="color color-status" style="background-color:#1498ea"></div>Printing</div>';
                if(data.S_STATE == 'printed') state = '<div class="color-list"><div class="color color-status" style="background-color:#084e8a"></div>Printed</div>';
                if(data.S_STATE == 'reject') state = '<div class="color-list"><div class="color color-status" style="background-color:#ed6347"></div>Rejected</div>';
                if(data.S_STATE == 'approved') state = '<div class="color-list"><div class="color color-status" style="background-color:#03be5b"></div>Done</div>';
                if(data.S_STATE == 'deny') state = '<div class="color-list"><div class="color color-status" style="background-color:#ed6347"></div>Deny</div>';
                return state;
                }
            },
            {'targets': 2,
                'data': null,
                'render': function ( data, type, full, meta ) {
                var camp_name = '<span class="printing-label label-link" prodprintingid="' + data.S_ID + '">' + data.S_PRODUCT_NAME + '</span>';
                return camp_name;
                }
            },
            {'targets': 3, 'orderable': false,
                'data': null,
                'render': function ( data, type, full, meta ) {
                    //Get design image
                    var img1 = '';
                    var img2 = '';
                    
                    if(data.S_PRODUCT_FRONT_IMG_URL) img1 = '<img src="'+data.S_PRODUCT_FRONT_IMG_URL+'" style="max-width:40px;max-height:40px"/>';
                    if(data.S_PRODUCT_BACK_IMG_URL) img2 = '<img src="'+data.S_PRODUCT_BACK_IMG_URL+'" style="max-width:40px;max-height:40px"/>';

                    var col_design = '<div class="design-img-table img-printing" style="cursor:pointer" prodprintingid="' + data.S_ID + '"><div class="design-img-cell">'+img1+'</div><div class="design-img-cell">'+img2+'</div></div>';
                    return col_design;
                }
            },
            {'targets': 4, 'orderable': false,
                'data': null,
                'render': function ( data, type, full, meta ) {
                    //Get design image
                    var img1 = '';
                    var img2 = '';
                    
                    if(data.S_FRONT_IMAGE_URL) img1 = '<img src="'+data.S_FRONT_IMAGE_URL+'" style="max-width:40px;max-height:40px"/>';
                    if(data.S_BACK_IMAGE_URL) img2 = '<img src="'+data.S_BACK_IMAGE_URL+'" style="max-width:40px;max-height:40px"/>';

                    var col_design = '<div class="design-img-table img-printing-design" style="cursor:pointer" prodprintingid="' + data.S_ID + '"><div class="design-img-cell">'+img1+'</div><div class="design-img-cell">'+img2+'</div></div>';
                    return col_design;
                }
            },
            {'targets': 7, 'orderable': false,
                'data': null,
                'render': function ( data, type, full, meta ) {
                    var due_date = data.N_MAX_DAY + " day(s)";
                    return due_date;
                }
            },
            {'targets': 9, 'orderable': false,
                'data': null,
                'render': function ( data, type, full, meta ) {
                    var img = '';
                    if(data.S_STATE == 'created')
                    img = '<img class="img-printing" prodprintingid="' + data.S_ID + '" src="'+absolutePath+'resource/image/checked.png" style="cursor:pointer"/>';
                    return img;
                }
            },
            {'targets': 10, 'orderable': false,
                'data': null,
                'render': function ( data, type, full, meta ) {
                    var img = '';
                    if(data.S_STATE == 'created')
                    img = '<img class="img-printing" prodprintingid="' + data.S_ID + '" src="'+absolutePath+'resource/image/forbidden.png" style="cursor:pointer"/>';
                    return img;
                }
            },
            ],
        'aaSorting': [[6, 'desc']],
        'processing': true,
        'serverSide': true,
        'ajax': {
            url: backendurl + "?cmd=getProductPrintingData",
            data: function ( d ) {
                d.state = $('#option-state').val();
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
            { "data": "N_QUANTITY" },
            { "data": "DD_CREATE" },
            { "data": null },
            { "data": "DD_EXPIRE" },
            { "data": null },
            { "data": null }
        ],
        "fnDrawCallback" : function() {
            $('#tb-form-loader').hide();
        },
        processing: false
    });
    
    getCountProductPrinting();

    $('#btn-printing-apply').on('click', function (e) {
        $('.dropdown-setting').removeClass('open');
        $.each($(".chk-col-printing"), function(i,item){
            if($(this).is(':checked')){
                $("#tb-form").DataTable().column($(this).attr('colnumb')).visible(true);
            }
            else{
                $("#tb-form").DataTable().column($(this).attr('colnumb')).visible(false);
            }
        });
    });

    $("#btn-form-accept").on('click', function (e) {
        $("#option-state").selectval('created');
        getData();
        $("#p-accept-problem").hide();
        $("#div-form-accept").show();
        $("#txt-form-info").focus();
        table1.column(0).visible(true);
    });

    $("#btn-accept").on('click', function (e) {
        acceptData();
    });

    $('#tb-form').on('draw.dt', function() {
        $('.chk-all').attr('checked',true);
        $('.chk-prod-printing').attr('checked',true);

        $('.chk-all').on('click', function() {
            if($(this).is(':checked')){
                $('.chk-prod-printing').prop('checked', true);
            }
            else{
                $('.chk-prod-printing').prop('checked', false);
            }
        });

        $('.printing-label').off('click').on('click', function (e) {
            openModalPrinting($(this).attr('prodprintingid'),'printing-preview');
        });
        $('.img-printing').off('click').on('click', function (e) {
            openModalPrinting($(this).attr('prodprintingid'),'printing-preview');
        });
        $('.img-printing-design').off('click').on('click', function (e) {
            openModalPrinting($(this).attr('prodprintingid'),'printing-design');
        });
    });

})(jQuery, $.AdminLTE);