
(function ($, AdminLTE) {
    //get absolute path
    var loc = window.location;
    var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
    var absolutePath = loc.protocol + '//' + loc.host + pathName;
    //backend url
    var backendurl = absolutePath + 'modules/inc/partner.php';

    var select_id = '';
    //user array
    var user_arr = [];

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
        $("#txt-form-info").val('');
        $("#sl-form-state").selectval('approved');
        $("#div-name-problem").hide();
        $("#div-info-problem").hide();

        $('.nav-tabs a[href="#tab2"]').parent().hide();
        
        $("#txt-form-name").focus();
        select_id = '';
    }

    //function edit data
    function editData(){
        $("#txt-form-name").focus();
        $("#div-name-problem").hide();
        $("#div-info-problem").hide();

        $('.nav-tabs a[href="#tab2"]').parent().show();
        
        $("#modal-form-loader").show();
        $.ajax({
            url: backendurl,
            type: "GET",
            dataType: 'json',
            data: {cmd: 'getPartnerDataById',
                    id: select_id},
            success: function (data) {
                $("#modal-form-loader").hide();
                if(data && data.result && data.result[0]) {                         
                    $("#txt-form-name").val(data.result[0].S_NAME);
                    $("#txt-form-info").val(data.result[0].S_INFO);
                    $("#sl-form-state").selectval(data.result[0].S_STATE);
                    $("#sl-form-type").selectval(data.result[0].S_TYPE);
                }
            },
            error: function () {
                openModalError();
            }
        });
        getPartnerUserData();
    }

    //func save data
    function saveData(){
        if(!$.trim($("#txt-form-name").val())){
            $("#div-name-problem").show();
            return;
        }
        else{
            $("#div-name-problem").hide();
        }
        if(!$.trim($("#txt-form-info").val())){
            $("#div-info-problem").show();
            return;
        }
        else{
            $("#div-info-problem").hide();
        }
        $("#modal-form-loader").show();
        $.ajax({
            url: backendurl,
            type: "POST",
            dataType: 'json',
            data: {cmd: 'savePartnerData',
                    id: select_id,
                    name: $("#txt-form-name").val(),
                    info: $("#txt-form-info").val(),
                    state: $("#sl-form-state").val(),
                    type: $("#sl-form-type").val()
                    },
            success: function (data) {
                $("#modal-form-loader").hide();
                $("#div-name-problem").hide();
                $("#div-info-problem").hide();
                if(data && data.result) {  
                    select_id = data.result;                       
                    $("#lb-form-saved").show();
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
            data: {cmd: 'removePartnerData',
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

    var chk_load_user_firsttime = 0;
    //func get user data
    function getPartnerUserData(){
        $("#modal-form-loader").show();
        if(chk_load_user_firsttime == 0){
            chk_load_user_firsttime = 1;
            $("#tb-user").DataTable({
                'columnDefs': [
                    {'targets': 0, 'orderable': false, 'width':'10px',
                    'defaultContent': '<div class="checkbox icheck checkbox-warning"><input type="checkbox" class="chk-user"><label></label></div>'
                    }
                    ],
                'aaSorting': [[1, 'asc']],
                'processing': true,
                'serverSide': true,
                'ajax': {
                    url: backendurl + "?cmd=getPartnerUserData",
                    data: function ( d ) {
                        d.partner_id = select_id;
                    },
                    error: function () {
                        openModalError();
                    }
                },
                "columns": [
                    { "data": null },
                    { "data": "S_EMAIL" }
                ],
                "fnDrawCallback" : function() {
                    $('#modal-form-loader').hide();
                },
                processing: false
                
            });
            $("#tb-user-available").DataTable({
                'columnDefs': [
                    {'targets': 0, 'orderable': false, 'width':'10px',
                    'defaultContent': '<div class="checkbox icheck checkbox-warning"><input type="checkbox" class="chk-user-available"><label></label></div>'
                    }
                    ],
                'aaSorting': [[1, 'asc']],
                'processing': true,
                'serverSide': true,
                'ajax': {
                    url: backendurl + "?cmd=getPartnerUserAvailableData",
                    data: function ( d ) {
                        d.partner_id = select_id;
                    },
                    error: function () {
                        openModalError();
                    }
                },
                "columns": [
                    { "data": null },
                    { "data": "S_EMAIL" }
                ],
                "fnDrawCallback" : function() {
                    $('#modal-form-loader').hide();
                },
                processing: false
                
            });
            $("#tb-user_info").parent().hide();
            $("#tb-user_info").parent().next().removeClass('col-sm-7').addClass('col-sm-12');
            $("#tb-user_length").parent().hide();
            $("#tb-user_length").parent().next().removeClass('col-sm-6').addClass('col-sm-12');
            $("#tb-user-available_info").parent().hide();
            $("#tb-user-available_info").parent().next().removeClass('col-sm-7').addClass('col-sm-12');
            $("#tb-user-available_length").parent().hide();
            $("#tb-user-available_length").parent().next().removeClass('col-sm-6').addClass('col-sm-12');

            $('.chk-all-user').on('change', function (event){
                if($(this).is(':checked'))
                    $(".chk-user").prop('checked', true);
                else{
                    $(".chk-user").prop('checked', false);
                }
            });

            $('.chk-all-user-available').on('change', function (event){
                if($(this).is(':checked'))
                    $(".chk-user-available").prop('checked', true);
                else{
                    $(".chk-user-available").prop('checked', false);
                }
            });
        }
        else{
            $('.chk-all-user').prop('checked', false);
            $('.chk-all-user-available').prop('checked', false);
            $("#tb-user").DataTable().ajax.reload();
            $("#tb-user-available").DataTable().ajax.reload();
        }
    }

    //func save partner user
    function savePartnerUserData(type){
        $("#modal-form-loader").show();
        $.ajax({
            url: backendurl,
            type: "POST", //GET, POST, PUT, DELETE
            dataType: 'json',
            //contentType: 'application/json',
            data: {cmd: 'savePartnerUserData',
                   id: select_id,
                   user_arr: user_arr,
                   type: type
                  },
            success: function (data) {
                getPartnerUserData();
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
    var table1 = $("#tb-partner").DataTable({
        'columnDefs': [
            { 'orderable': false, 'width':'10px', 'targets': 5, 'defaultContent': edit_icon},
            { 'orderable': false,  'width':'10px', 'targets': 6, 'defaultContent': remove_icon},
            {'targets': 2,
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
            url: backendurl + "?cmd=getPartnerData",
            data: function ( d ) {
                d.state = $("#option-partner-state").val();
            },
            error: function () {
                openModalError();
            }
        },
        'columns': [
            { "data": "S_NAME" },
            { "data": "S_TYPE" },
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

    $('#tb-partner').on('draw.dt', function() {
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

    $('#btn-partner-apply').on('click', function (e) {
        $('.dropdown-setting').removeClass('open');
        $.each($(".chk-col-partner"), function(i,item){
            if($(this).is(':checked')){
                $("#tb-partner").DataTable().column($(this).attr('colnumb')).visible(true);
            }
            else{
                $("#tb-partner").DataTable().column($(this).attr('colnumb')).visible(false);
            }
        });
    });

    $('#btn-form-assign').on( 'click', function () {
        user_arr = [];
        $.each($(".chk-user-available"), function(i,item){
            if($(this).is(':checked')){
                var user_id = $("#tb-user-available").DataTable().row($(this).closest('tr')).data().S_ID;
                user_arr.push(user_id);
            }
        });
        savePartnerUserData('add');
    });
    $('#btn-form-remove').on( 'click', function () {
        user_arr = [];
        $.each($(".chk-user"), function(i,item){
            if($(this).is(':checked')){
                var user_id = $("#tb-user").DataTable().row($(this).closest('tr')).data().S_ID;
                user_arr.push(user_id);
            }
        });
        savePartnerUserData('remove');
    });

    $("#btn-form-save").on('click', function (e) {
        saveData();
    });

})(jQuery, $.AdminLTE);