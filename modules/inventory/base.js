
(function ($, AdminLTE) {
    //get absolute path
    var loc = window.location;
    var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
    var absolutePath = loc.protocol + '//' + loc.host + pathName;
    //backend url
    var backendurl = absolutePath + 'modules/inc/inventory.php';

    var select_id = '';
    //sizes array
    var sizes_arr = [];
    //colors array
    var colors_arr = [];

    $('.select-box').selectctr();

    $('#btn-add').on( 'click', function () {
        addNew();
    });
    $('#btn-refresh').on( 'click', function () {
        getData();
    });

    //function add new
    function addNew(){
        $('#modal-form').modal('show');
        $('#modal-form').each(reposition);

        $('.nav-tabs a[href="#tab1"]').tab('show');
        $("#txt-form-name").val('');
        $("#txt-form-desc").val('');
        $("#txt-form-position").val('');
        $("#sl-form-state").selectval('approved');

        $("#txt-form-price").val('');
        $("#sl-form-currency").selectval('USD');
        $("#chk-form-include").prop('checked',true);

        $("#txt-form-front-img-url").val('');
        $("#txt-form-front-img-width").val('');
        $("#txt-form-front-img-height").val('');
        $("#txt-form-back-img-url").val('');
        $("#txt-form-back-img-width").val('');
        $("#txt-form-back-img-height").val('');
        $("#txt-form-full-fillment").val('');

        $("#txt-form-printable-front-top").val('');
        $("#txt-form-printable-front-left").val('');
        $("#txt-form-printable-front-width").val('');
        $("#txt-form-printable-front-height").val('');
        $("#txt-form-printable-back-top").val('');
        $("#txt-form-printable-back-left").val('');
        $("#txt-form-printable-back-width").val('');
        $("#txt-form-printable-back-height").val('');

        $('.nav-tabs a[href="#tab4"]').parent().hide();
        $('.nav-tabs a[href="#tab5"]').parent().hide();

        $('#progress-front').html('');
        $('#progress-back').html('');
        
        $("#txt-form-name").focus();
        select_id = '';
    }

    //function edit data
    function editData(){
        $("#txt-form-name").focus();
        $("#modal-form-loader").show();

        $('.nav-tabs a[href="#tab4"]').parent().show();
        $('.nav-tabs a[href="#tab5"]').parent().show();

        $('#progress-front').html('');
        $('#progress-back').html('');

        sizes_arr = [];
        colors_arr = [];
        $.ajax({
            url: backendurl,
            type: "GET",
            dataType: 'json',
            data: {cmd: 'getBaseDataById',
                    id: select_id},
            success: function (data) {
                $("#modal-form-loader").hide();
                if(data && data.result && data.result[0]) {                         
                    $("#sl-form-type").val(data.result[0].S_TYPE_ID).change();                        
                    $("#txt-form-name").val(data.result[0].S_NAME);
                    $("#txt-form-desc").val(data.result[0].S_DESC);
                    $("#txt-form-position").val(data.result[0].N_POSITION);
                    $("#sl-form-state").selectval(data.result[0].S_STATE);
                    $("#txt-form-price").val(data.result[0].S_PRICE);
                    $("#sl-form-currency").selectval(data.result[0].S_CURRENCY);

                    if(data.result[0].N_INCLUDE == 1) $("#chk-form-include").prop('checked',true);    
                    else $("#chk-form-include").prop('checked',false);

                    $("#txt-form-front-img-url").val(data.result[0].S_FRONT_IMG_URL);
                    $("#txt-form-front-img-width").val(data.result[0].S_FRONT_IMG_WIDTH);
                    $("#txt-form-front-img-height").val(data.result[0].S_FRONT_IMG_HEIGHT);
                    $("#txt-form-back-img-url").val(data.result[0].S_BACK_IMG_URL);
                    $("#txt-form-back-img-width").val(data.result[0].S_BACK_IMG_WIDTH);
                    $("#txt-form-back-img-height").val(data.result[0].S_BACK_IMG_HEIGHT);
                    $("#txt-form-full-fillment").val(data.result[0].N_FULL_FILLMENT);

                    $("#txt-form-printable-front-top").val(data.result[0].S_PRINTABLE_FRONT_TOP);
                    $("#txt-form-printable-front-left").val(data.result[0].S_PRINTABLE_FRONT_LEFT);
                    $("#txt-form-printable-front-width").val(data.result[0].S_PRINTABLE_FRONT_WIDTH);
                    $("#txt-form-printable-front-height").val(data.result[0].S_PRINTABLE_FRONT_HEIGHT);
                    $("#txt-form-printable-back-top").val(data.result[0].S_PRINTABLE_BACK_TOP);
                    $("#txt-form-printable-back-left").val(data.result[0].S_PRINTABLE_BACK_LEFT);
                    $("#txt-form-printable-back-width").val(data.result[0].S_PRINTABLE_BACK_WIDTH);
                    $("#txt-form-printable-back-height").val(data.result[0].S_PRINTABLE_BACK_HEIGHT);

                    $("#img-front").attr("src",data.result[0].S_FRONT_IMG_URL);
                    $("#img-front").width(data.result[0].S_FRONT_IMG_WIDTH/2);
                    $("#img-front").height(data.result[0].S_FRONT_IMG_HEIGHT/2);

                    $("#div-front-bgr").width(data.result[0].S_FRONT_IMG_WIDTH/2);
                    $("#div-front-bgr").height(data.result[0].S_FRONT_IMG_HEIGHT/2);

                    $("#div-printable-front").css("top",data.result[0].S_PRINTABLE_FRONT_TOP/2 + "px");
                    $("#div-printable-front").css("left",data.result[0].S_PRINTABLE_FRONT_LEFT/2 + "px");
                    $("#div-printable-front").css("width",data.result[0].S_PRINTABLE_FRONT_WIDTH/2);
                    $("#div-printable-front").css("height",data.result[0].S_PRINTABLE_FRONT_HEIGHT/2);

                    $("#img-back").attr("src",data.result[0].S_BACK_IMG_URL);
                    $("#img-back").width(data.result[0].S_BACK_IMG_WIDTH/2);
                    $("#img-back").height(data.result[0].S_BACK_IMG_HEIGHT/2);

                    $("#div-back-bgr").width(data.result[0].S_BACK_IMG_WIDTH/2);
                    $("#div-back-bgr").height(data.result[0].S_BACK_IMG_HEIGHT/2);

                    $("#div-printable-back").css("top",data.result[0].S_PRINTABLE_BACK_TOP/2 + "px");
                    $("#div-printable-back").css("left",data.result[0].S_PRINTABLE_BACK_LEFT/2 + "px");
                    $("#div-printable-back").css("width",data.result[0].S_PRINTABLE_BACK_WIDTH/2);
                    $("#div-printable-back").css("height",data.result[0].S_PRINTABLE_BACK_HEIGHT/2);

                    if(data.result[0].S_SIZES) sizes_arr = data.result[0].S_SIZES.split(',');
                    if(data.result[0].S_COLORS) colors_arr = data.result[0].S_COLORS.split(',');
                }
            },
            error: function () {
                openModalError();
            }
        });
        getBaseSizeData();
        getBaseColorData();
    }

    //func save data
    function saveData(){
        $("#modal-form-loader").show();
        $.ajax({
            url: backendurl,
            type: "POST",
            dataType: 'json',
            data: {cmd: 'saveBaseData',
                id: select_id,
                type: $("#sl-form-type").val(),
                name: $("#txt-form-name").val(),
                desc: $("#txt-form-desc").val(),
                position: $("#txt-form-position").val(),
                state: $("#sl-form-state").val(),

                price: $("#txt-form-price").val(),
                currency: $("#sl-form-currency").val(),
                include: ($('#chk-form-include').parent().hasClass('checked'))?1:0,

                icon_img_url: '',
                front_img_url: $("#txt-form-front-img-url").val(),
                front_img_width: $("#txt-form-front-img-width").val(),
                front_img_height: $("#txt-form-front-img-height").val(),
                back_img_url: $("#txt-form-back-img-url").val(),
                back_img_width: $("#txt-form-back-img-width").val(),
                back_img_height: $("#txt-form-back-img-height").val(),
                full_fillment: $("#txt-form-full-fillment").val(),

                printable_front_top: $("#txt-form-printable-front-top").val(),
                printable_front_left: $("#txt-form-printable-front-left").val(),
                printable_front_width: $("#txt-form-printable-front-width").val(),
                printable_front_height: $("#txt-form-printable-front-height").val(),
                printable_back_top: $("#txt-form-printable-back-top").val(),
                printable_back_left: $("#txt-form-printable-back-left").val(),
                printable_back_width: $("#txt-form-printable-back-width").val(),
                printable_back_height: $("#txt-form-printable-back-height").val()
            },
            success: function (data) {
                $("#modal-form-loader").hide();
                $("#div-price-problem").hide();
                if(data && data.result) {
                    select_id = data.result; 
                }
            },
            error: function () {
                openModalError();
            }
        });
    }

    //func remove data
    function removeData(){
        $("#tb-form-loader").show();
        $.ajax({
            url: backendurl,
            type: "POST",
            dataType: 'json',
            data: {cmd: 'removeBaseData',
                   id: select_id
                  },
            success: function (data) {
                $("#form-loader").hide();
                if(data && data.result) {                         
                    getData();
                }
            },
            error: function () {
                openModalError();
            }
        });
    }

    //function get type combo
    function getTypeCombo(){
        $("#lb-form-loading").show();
        $("#lb-form-saved").hide();
        $.ajax({
            url: backendurl,
            type: "GET", //GET, POST, PUT, DELETE
            dataType: 'json',
            //contentType: 'application/json',
            data: {cmd: 'getBaseTypeCombo'},
            success: function (data) {
                $("#lb-form-loading").hide();
                if(data && data.result) { 
                    var xdata = [];                        
                    $.each(data.result, function(i,row){
                        xdata.push({id: row.S_ID, text: row.S_NAME});
                                     
                    });
                    $("#sl-form-type").select2({
                        data: xdata
                    });
                }
            },
            error: function () {
                openModalError();
            }
        });
    }

    var chk_load_size_firsttime = 0;
    //func get base size data
    function getBaseSizeData(){
        if(chk_load_size_firsttime == 0){
            chk_load_size_firsttime = 1;
            $("#tb-base-size").DataTable({
                'columnDefs': [
                    {'targets': 0, 'orderable': false, 'width':'10px',
                    'defaultContent': '<div class="checkbox icheck checkbox-warning"><input type="checkbox" class="chk-base-size"><label></label></div>'
                    }
                    ],
                'aaSorting': [[1, 'asc']],
                'processing': true,
                'serverSide': true,
                'ajax': {
                    url: backendurl + "?cmd=getBase_BaseSizeData",
                    data: function ( d ) {
                        d.base_id = select_id;
                    },
                    error: function () {
                        openModalError();
                    }
                },
                "columns": [
                    { "data": null },
                    { "data": "S_NAME" }
                ]
                
            });
            $("#tb-base-size-available").DataTable({
                'columnDefs': [
                    {'targets': 0, 'orderable': false, 'width':'10px',
                    'defaultContent': '<div class="checkbox icheck checkbox-warning"><input type="checkbox" class="chk-base-size-available"><label></label></div>'
                    }
                    ],
                'aaSorting': [[1, 'asc']],
                'processing': true,
                'serverSide': true,
                'ajax': {
                    url: backendurl + "?cmd=getBase_BaseSizeAvailableData",
                    data: function ( d ) {
                        d.base_id = select_id;
                    },
                    error: function () {
                        openModalError();
                    }
                },
                "columns": [
                    { "data": null },
                    { "data": "S_NAME" }
                ]
                
            });
            $("#tb-base-size_info").parent().hide();
            $("#tb-base-size_info").parent().next().removeClass('col-sm-7').addClass('col-sm-12');
            $("#tb-base-size_length").parent().hide();
            $("#tb-base-size_length").parent().next().removeClass('col-sm-6').addClass('col-sm-12');
            $("#tb-base-size-available_info").parent().hide();
            $("#tb-base-size-available_info").parent().next().removeClass('col-sm-7').addClass('col-sm-12');
            $("#tb-base-size-available_length").parent().hide();
            $("#tb-base-size-available_length").parent().next().removeClass('col-sm-6').addClass('col-sm-12');

            $('.chk-all-size').on('change', function (event){
                if($(this).is(':checked'))
                    $(".chk-base-size").prop('checked', true);
                else{
                    $(".chk-base-size").prop('checked', false);
                }    
            });

            $('.chk-all-size-available').on('change', function (event){
                if($(this).is(':checked'))
                    $(".chk-base-size-available").prop('checked', true);
                else{
                    $(".chk-base-size-available").prop('checked', false);
                }    
            });
        }
        else{
            $('.chk-all-size').prop('checked', false);
            $('.chk-all-size-available').prop('checked', false);
            $("#tb-base-size").DataTable().ajax.reload();
            $("#tb-base-size-available").DataTable().ajax.reload();
        }
    }

    //func save base size
    function saveBaseSizeData(){
        var str_sizes = '';
        for(var i = 0; i < sizes_arr.length; i++){
            if(i != 0) str_sizes += ',';
            str_sizes +=  sizes_arr[i];
        }
        $.ajax({
            url: backendurl,
            type: "POST", //GET, POST, PUT, DELETE
            dataType: 'json',
            //contentType: 'application/json',
            data: {cmd: 'saveBase_BaseSizeData',
                   id: select_id,
                   sizes: str_sizes
                  },
            success: function (data) {
                getBaseSizeData();
            },
            error: function () {
                openModalError();
            }
        });
    }

    var chk_load_color_firsttime = 0;
    //func get base color data
    function getBaseColorData(){
        if(chk_load_color_firsttime == 0){
            chk_load_color_firsttime = 1;
            $("#tb-base-color").DataTable({
                'columnDefs': [
                    {'targets': 0, 'orderable': false, 'width':'10px',
                    'defaultContent': '<div class="checkbox icheck checkbox-warning"><input type="checkbox" class="chk-base-color"><label></label></div>'
                    },
                    {'targets': 2, 'orderable': false,
                        'data': null,
                        'render': function ( data, type, full, meta ) {
                            var value_col = '<table><tr><td width="100%">'+data.S_VALUE+'</td><td><div style="width:20px;height:20px;background-color:'+data.S_VALUE+'"></div></td></tr></table>';
                            return value_col;
                        }
                    }
                    ],
                'aaSorting': [[1, 'asc']],
                'processing': true,
                'serverSide': true,
                'ajax': {
                    url: backendurl + "?cmd=getBase_BaseColorData",
                    data: function ( d ) {
                        d.base_id = select_id;
                    },
                    error: function () {
                        openModalError();
                    }
                },
                "columns": [
                    { "data": null },
                    { "data": "S_NAME" },
                    { "data": null }
                ]
                
            });
            $("#tb-base-color-available").DataTable({
                'columnDefs': [
                    {'targets': 0, 'orderable': false, 'width':'10px',
                    'defaultContent': '<div class="checkbox icheck checkbox-warning"><input type="checkbox" class="chk-base-color-available"><label></label></div>'
                    },
                    {'targets': 2, 'orderable': false,
                        'data': null,
                        'render': function ( data, type, full, meta ) {
                            var value_col = '<table><tr><td width="100%">'+data.S_VALUE+'</td><td><div style="width:20px;height:20px;background-color:'+data.S_VALUE+'"></div></td></tr></table>';
                            return value_col;
                        }
                    }
                    ],
                'aaSorting': [[1, 'asc']],
                'processing': true,
                'serverSide': true,
                'ajax': {
                    url: backendurl + "?cmd=getBase_BaseColorAvailableData",
                    data: function ( d ) {
                        d.base_id = select_id;
                    },
                    error: function () {
                        openModalError();
                    }
                },
                "columns": [
                    { "data": null },
                    { "data": "S_NAME" },
                    { "data": null }
                ]
                
            });
            $("#tb-base-color_info").parent().hide();
            $("#tb-base-color_info").parent().next().removeClass('col-sm-7').addClass('col-sm-12');
            $("#tb-base-color_length").parent().hide();
            $("#tb-base-color_length").parent().next().removeClass('col-sm-6').addClass('col-sm-12');
            $("#tb-base-color-available_info").parent().hide();
            $("#tb-base-color-available_info").parent().next().removeClass('col-sm-7').addClass('col-sm-12');
            $("#tb-base-color-available_length").parent().hide();
            $("#tb-base-color-available_length").parent().next().removeClass('col-sm-6').addClass('col-sm-12');

            $('.chk-all-color').on('change', function (event){
                if($(this).is(':checked'))
                    $(".chk-base-color").prop('checked', true);
                else{
                    $(".chk-base-color").prop('checked', false);
                }    
            });

            $('.chk-all-color-available').on('change', function (event){
                if($(this).is(':checked'))
                    $(".chk-base-color-available").prop('checked', true);
                else{
                    $(".chk-base-color-available").prop('checked', false);
                }    
            });
        }
        else{
            $('.chk-all-color').prop('checked', false);
            $('.chk-all-color-available').prop('checked', false);

            $("#tb-base-color").DataTable().ajax.reload();
            $("#tb-base-color-available").DataTable().ajax.reload();
        }
    }

    //func save base color
    function saveBaseColorData(){
        var str_colors = '';
        for(var i = 0; i < colors_arr.length; i++){
            if(i != 0) str_colors += ',';
            str_colors +=  colors_arr[i];
        }
        $.ajax({
            url: backendurl,
            type: "POST", //GET, POST, PUT, DELETE
            dataType: 'json',
            //contentType: 'application/json',
            data: {cmd: 'saveBase_BaseColorData',
                   id: select_id,
                   colors: str_colors
                  },
            success: function (data) {
                getBaseColorData();
            },
            error: function () {
                openModalError();
            }
        });
    }

    function getData(){
        $('#tb-form-loader').show();
        table1.ajax.reload();
    }

    //ready function
    var edit_icon = '<a href="javascript:void(0)" class="i-form-edit" ><i class="i-form ion-compose" title="Edit"></i></a>';
    var remove_icon = '<div class="dropdown dropdown-form"><a href="javascript:void(0)" class="dropdown-toggle" data-toggle="dropdown"><i class="i-form ion-close" title="Remove"></i></a>';
    remove_icon += '<ul class="dropdown-menu pull-right"><li><a class="i-form-remove" href="javascript:void(0)"> Do you want to remove this row?</a></li></ul></div>';
    var table1 = $("#tb-form").DataTable({
        'columnDefs': [
            { 'orderable': false, 'width':'10px', 'targets': 9, 'defaultContent': edit_icon},
            { 'orderable': false,  'width':'10px', 'targets': 10, 'defaultContent': remove_icon},
            {'targets': 3,
                'data': null,
                'render': function ( data, type, full, meta ) {
                    var price_data = '0 ' + data.S_CURRENCY;
                    if(data.S_PRICE) price_data = data.S_PRICE + ' ' + data.S_CURRENCY;
                    return price_data;
                }
            },
            {'targets': 4, 'orderable': false,
                'data': null,
                'render': function ( data, type, full, meta ) {
                    //Get design image
                    var img1 = '';
                    var img2 = '';
                    if(data.S_FRONT_IMG_URL) img1 = '<img src="'+data.S_FRONT_IMG_URL+'" style="max-width:40px;max-height:40px"/>';
                    if(data.S_BACK_IMG_URL) img2 = '<img src="'+data.S_BACK_IMG_URL+'" style="max-width:40px;max-height:40px"/>';

                    var col_img = '<div class="design-img-table"><div class="design-img-cell">'+img1+'</div><div class="design-img-cell">'+img2+'</div></div>';
                    return col_img;
                }
            },
            {'targets': 6,
                'data': null,
                'render': function ( data, type, full, meta ) {
                    var state = '';
                    if(data.S_STATE == 'approved') state = '<div class="color-list"><div class="color color-status" style="background-color:#03be5b"></div>Approved</div>';
                    if(data.S_STATE == 'unapproved') state = '<div class="color-list"><div class="color color-status" style="background-color:#ed6347"></div>Unapproved</div>';
                    if(data.S_STATE == 'deleted') state = '<div class="color-list"><div class="color color-status" style="background-color:#ed6347"></div>Deleted</div>';
                    return state;
                }
            },
            ],
        'aaSorting': [[0, 'asc']],
        'processing': true,
        'serverSide': true,
        'ajax':{
            url: backendurl + "?cmd=getBaseData",
            data: function ( d ) {
                d.state = $("#option-filter-state").val();
            },
            error: function () {
                openModalError();
            }
        },
        'columns': [
            { "data": "S_NAME" },
            { "data": "TYPE_NAME" },
            { "data": "S_DESC" },
            { "data": null},
            { "data": null },
            { "data": "N_POSITION" },
            { "data": null },
            { "data": "DD_CREATE" },
            { "data": "DD_UPDATE" },
            { "data": null },
            { "data": null }
        ],
        "fnDrawCallback" : function() {
            $('#tb-form-loader').hide();
        },
        processing: false
    });

    getTypeCombo();

    $('#tb-form').on('draw.dt', function() {
        $(".i-form-edit").off('click').on('click', function (e) {
            select_id = table1.row(this.closest('tr')).data().S_ID;
            $('#modal-form').modal('show');
            $('#modal-form').each(reposition);
            editData();
        });
        $(".i-form-remove").off('click').on('click', function (e) {
            select_id = table1.row(this.closest('tr')).data().S_ID;
            removeData();
        });
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

    $("#btn-form-save").on('click', function (e) {
        saveData();
    });

    $('#drag-and-drop-front').dmUploader({
        url: absolutePath + 'upload/php/upload.php',
        extraData: {type: 'front'},
        dataType: 'json',
        allowedTypes: 'image/*',
        onBeforeUpload: function(id){
            $('#progress-front').html('');
            temp = '<div class="progress progress-striped active">'+
                        '<div class="progress-bar" role="progressbar" style="width: 0%;">'+
                            '<span class="sr-only">0% Complete</span>'+
                        '</div>'+
                    '</div>';
            $('#progress-front').html(temp);
        },
        onComplete: function(){
            
        },
        onUploadProgress: function(id, percent){
            var percentStr = percent + '%';
            $('#progress-front').find('div.progress-bar').width(percent);
        },
        onUploadSuccess: function(id, data){
            $('#progress-front').find('div.progress-bar').width("100%");
            $("#txt-form-front-img-url").val(data.src);
            $("#img-front").attr("src",data.src);
            //saveData();
        },
        onUploadError: function(id, message){
            alert('Failed to Upload file #' + id + ': ' + message);
        },
        onFileTypeError: function(file){
            alert('File \'' + file.name + '\' cannot be added: must be an image');
        },
        onFileSizeError: function(file){
            alert('File \'' + file.name + '\' cannot be added: size excess limit');
        },
        onFallbackMode: function(message){
            alert('Browser not supported(do something else here!): ' + message);
        }
    });

    $('#drag-and-drop-back').dmUploader({
        url: absolutePath + 'upload/php/upload.php',
        extraData: {type: 'back'},
        dataType: 'json',
        allowedTypes: 'image/*',
        onBeforeUpload: function(id){
            $('#progress-back').html('');
            temp = '<div class="progress progress-striped active">'+
                        '<div class="progress-bar" role="progressbar" style="width: 0%;">'+
                            '<span class="sr-only">0% Complete</span>'+
                        '</div>'+
                    '</div>';
            $('#progress-back').html(temp);
        },
        onComplete: function(){
            
        },
        onUploadProgress: function(id, percent){
            var percentStr = percent + '%';
            $('#progress-back').find('div.progress-bar').width(percent);
        },
        onUploadSuccess: function(id, data){
            $('#progress-back').find('div.progress-bar').width("100%");
            $("#txt-form-back-img-url").val(data.src);
            $("#img-back").attr("src",data.src);
            //saveData();
        },
        onUploadError: function(id, message){
            alert('Failed to Upload file #' + id + ': ' + message);
        },
        onFileTypeError: function(file){
            alert('File \'' + file.name + '\' cannot be added: must be an image');
        },
        onFileSizeError: function(file){
            alert('File \'' + file.name + '\' cannot be added: size excess limit');
        },
        onFallbackMode: function(message){
            alert('Browser not supported(do something else here!): ' + message);
        }
    });
    
    $('.img-front-size').on( 'keyup', function () {
        $("#img-front").width($("#txt-form-front-img-width").val()/2);
        $("#img-front").height($("#txt-form-front-img-height").val()/2);
        $("#div-front-bgr").width($("#txt-form-front-img-width").val()/2);
        $("#div-front-bgr").height($("#txt-form-front-img-height").val()/2);
    });
    $('.img-back-size').on( 'keyup', function () {
        $("#img-back").width($("#txt-form-back-img-width").val()/2);
        $("#img-back").height($("#txt-form-back-img-height").val()/2);
        $("#div-back-bgr").width($("#txt-form-back-img-width").val()/2);
        $("#div-back-bgr").height($("#txt-form-back-img-height").val()/2);
    });
    $('.printable-front').on( 'keyup', function () {
        $("#div-printable-front").css("top",$("#txt-form-printable-front-top").val()/2 + "px");
        $("#div-printable-front").css("left",$("#txt-form-printable-front-left").val()/2 + "px");
        $("#div-printable-front").css("width",$("#txt-form-printable-front-width").val()/2);
        $("#div-printable-front").css("height",$("#txt-form-printable-front-height").val()/2);
    });
    $('.printable-back').on( 'keyup', function () {
        $("#div-printable-back").css("top",$("#txt-form-printable-back-top").val()/2 + "px");
        $("#div-printable-back").css("left",$("#txt-form-printable-back-left").val()/2 + "px");
        $("#div-printable-back").css("width",$("#txt-form-printable-back-width").val()/2);
        $("#div-printable-back").css("height",$("#txt-form-printable-back-height").val()/2);
    });

    $('#btn-form-size-assign').on( 'click', function () {
        $.each($(".chk-base-size-available"), function(i,item){
            if($(this).is(':checked')){
                var size_id = $("#tb-base-size-available").DataTable().row($(this).closest('tr')).data().S_ID;
                sizes_arr.push(size_id);
            }
        });
        saveBaseSizeData();
    });
    $('#btn-form-size-remove').on( 'click', function () {
        $.each($(".chk-base-size"), function(i,item){
            if($(this).is(':checked')){
                var size_id = $("#tb-base-size").DataTable().row($(this).closest('tr')).data().S_ID;
                sizes_arr.splice( $.inArray(size_id, sizes_arr), 1 );
            }
        });
        saveBaseSizeData();
    });
    $('#btn-form-color-assign').on( 'click', function () {
        $.each($(".chk-base-color-available"), function(i,item){
            if($(this).is(':checked')){
                var color_id = $("#tb-base-color-available").DataTable().row($(this).closest('tr')).data().S_ID;
                colors_arr.push(color_id);
            }
        });
        saveBaseColorData();
    });
    $('#btn-form-color-remove').on( 'click', function () {
        $.each($(".chk-base-color"), function(i,item){
            if($(this).is(':checked')){
                var color_id = $("#tb-base-color").DataTable().row($(this).closest('tr')).data().S_ID;
                colors_arr.splice( $.inArray(color_id, colors_arr), 1 );
            }
        });
        saveBaseColorData();
    });

})(jQuery, $.AdminLTE);