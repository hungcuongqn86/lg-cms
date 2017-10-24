
(function ($, AdminLTE) {
    //get absolute path
    var loc = window.location;
    var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
    var absolutePath = loc.protocol + '//' + loc.host + pathName;
    //backend url
    var backendurl = absolutePath + 'modules/inc/setup.php';

    var select_id = '';

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
        $("#txt-form-note").val('');
        $("#sl-form-state").val('approved');
        $("#div-name-problem").hide();

        $('.nav-tabs a[href="#tab2"]').parent().hide();
        $('.nav-tabs a[href="#tab3"]').parent().hide();
        
        $("#txt-form-name").focus();
        select_id = '';
    }

    //function edit data
    function editData(){
        $("#txt-form-name").focus();
        $("#div-name-problem").hide();
        $("#modal-form-loader").show();

        $('.nav-tabs a[href="#tab2"]').parent().show();
        $('.nav-tabs a[href="#tab3"]').parent().show();
        $.ajax({
            url: backendurl,
            type: "GET",
            dataType: 'json',
            data: {cmd: 'getGroupDataById',
                    id: select_id},
            success: function (data) {
                $("#modal-form-loader").hide();
                if(data && data.result && data.result[0]) {                         
                    $("#txt-form-name").val(data.result[0].S_NAME);
                    $("#txt-form-note").val(data.result[0].S_NOTE);
                    $("#sl-form-state").selectval(data.result[0].S_STATE);
                }
            },
            error: function () {
                openModalError();
            }
        });
        getGroupModuleData();
        getGroupUserData();
    }

    //func save data
    function saveData(){
        if(!$.trim($("#txt-form-name").val())){
            $("#div-name-problem").show();
            return;
        }
        $("#modal-form-loader").show();
        $.ajax({
            url: backendurl,
            type: "POST",
            dataType: 'json',
            data: {cmd: 'saveGroupData',
                   id: select_id,
                   name: $("#txt-form-name").val(),
                   note: $("#txt-form-note").val(),
                   state: $("#sl-form-state").val()
                  },
            success: function (data) {
                $("#modal-form-loader").hide();
                $("#div-name-problem").hide();
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
            data: {cmd: 'removeGroupData',
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

    var chk_load_module_firsttime = 0;
    //func get Group module data
    function getGroupModuleData(){
        if(chk_load_module_firsttime == 0){
            chk_load_module_firsttime = 1;
            $("#tb-module").DataTable({
                            'columnDefs': [
                                {'targets': 0, 'orderable': false, 'width':'10px',
                                 'defaultContent': '<div class="checkbox icheck checkbox-warning"><input type="checkbox" class="chk-module"><label></label></div>'
                                }
                                ],
                            'aaSorting': [[1, 'asc']],
                            'processing': true,
                            'serverSide': true,
                            'ajax': {
                                url: backendurl + "?cmd=getGroupModuleData",
                                data: function ( d ) {
                                    d.id = select_id;
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
            $("#tb-module-available").DataTable({
                            'columnDefs': [
                                {'targets': 0, 'orderable': false, 'width':'10px',
                                 'defaultContent': '<div class="checkbox icheck checkbox-warning"><input type="checkbox" class="chk-module-available"><label></label></div>'
                                }
                                ],
                            'aaSorting': [[1, 'asc']],
                            'processing': true,
                            'serverSide': true,
                            'ajax': {
                                url: backendurl + "?cmd=getGroupModuleAvailableData",
                                data: function ( d ) {
                                    d.id = select_id;
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
            $("#tb-module_info").parent().hide();
            $("#tb-module_info").parent().next().removeClass('col-sm-7').addClass('col-sm-12');
            $("#tb-module_length").parent().hide();
            $("#tb-module_length").parent().next().removeClass('col-sm-6').addClass('col-sm-12');
            $("#tb-module-available_info").parent().hide();
            $("#tb-module-available_info").parent().next().removeClass('col-sm-7').addClass('col-sm-12');
            $("#tb-module-available_length").parent().hide();
            $("#tb-module-available_length").parent().next().removeClass('col-sm-6').addClass('col-sm-12');

            $('.chk-all-module').on('change', function (event){
                if($(this).is(':checked'))
                    $(".chk-module").prop('checked', true);
                else{
                    $(".chk-module").prop('checked', false);
                }
            });

            $('.chk-all-module-available').on('change', function (event){
                if($(this).is(':checked'))
                    $(".chk-module-available").prop('checked', true);
                else{
                    $(".chk-module-available").prop('checked', false);
                }
            });
        }
        else{
            $('.chk-all-module').prop('checked', false);
            $('.chk-all-module-available').prop('checked', false);
            $("#tb-module").DataTable().ajax.reload();
            $("#tb-module-available").DataTable().ajax.reload();
        }
    }

    //func save Group module
    function saveGroupModuleData(type){
        $.ajax({
            url: backendurl,
            type: "POST", //GET, POST, PUT, DELETE
            dataType: 'json',
            //contentType: 'application/json',
            data: {cmd: 'saveGroupModuleData',
                   id: select_id,
                   module_arr: module_arr,
                   type: type
                  },
            success: function (data) {
                getGroupModuleData();
            },
            error: function () {
                openModalError();
            }
        });
    }

    var chk_load_user_firsttime = 0;
    //func get Group user data
    function getGroupUserData(){
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
                                url: backendurl + "?cmd=getGroupUserData",
                                data: function ( d ) {
                                    d.id = select_id;
                                },
                                error: function () {
                                    openModalError();
                                }
                            },
                            "columns": [
                                { "data": null },
                                { "data": "S_EMAIL" }
                            ]
                            
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
                                url: backendurl + "?cmd=getGroupUserAvailableData",
                                data: function ( d ) {
                                    d.id = select_id;
                                },
                                error: function () {
                                    openModalError();
                                }
                            },
                            "columns": [
                                { "data": null },
                                { "data": "S_EMAIL" }
                            ]
                            
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

    //func save Group user
    function saveGroupUserData(type){
        $.ajax({
            url: backendurl,
            type: "POST", //GET, POST, PUT, DELETE
            dataType: 'json',
            //contentType: 'application/json',
            data: {cmd: 'saveGroupUserData',
                   id: select_id,
                   user_arr: user_arr,
                   type: type
                  },
            success: function (data) {
                getGroupUserData();
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
            { 'orderable': false, 'width':'10px', 'targets': 3, 'defaultContent': edit_icon},
            { 'orderable': false,  'width':'10px', 'targets': 4, 'defaultContent': remove_icon},
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
            url: backendurl + "?cmd=getGroupData",
            data: function ( d ) {
                d.state = $("#option-filter-state").val();
            },
            error: function () {
                openModalError();
            }
        },
        'columns': [
            { "data": "S_NAME" },
            { "data": "S_NOTE" },
            { "data": null },
            { "data": null },
            { "data": null }
        ],
        "fnDrawCallback" : function() {
            $('#tb-form-loader').hide();
        },
        processing: false
    });

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

    $('#btn-form-module-assign').on( 'click', function () {
        module_arr = [];
        $.each($(".chk-module-available"), function(i,item){
            if($(this).is(':checked')){
                var module_id = $("#tb-module-available").DataTable().row($(this).closest('tr')).data().S_ID;
                module_arr.push(module_id);
            }
        });
        saveGroupModuleData('add');
    });
    $('#btn-form-module-remove').on( 'click', function () {
        module_arr = [];
        $.each($(".chk-module"), function(i,item){
            if($(this).is(':checked')){
                var module_id = $("#tb-module").DataTable().row($(this).closest('tr')).data().S_ID;
                module_arr.push(module_id);
            }
        });
        saveGroupModuleData('remove');
    });

    $('#btn-form-user-assign').on( 'click', function () {
        user_arr = [];
        $.each($(".chk-user-available"), function(i,item){
            if($(this).is(':checked')){
                var user_id = $("#tb-user-available").DataTable().row($(this).closest('tr')).data().S_ID;
                user_arr.push(user_id);
            }
        });
        saveGroupUserData('add');
    });
    $('#btn-form-user-remove').on( 'click', function () {
        user_arr = [];
        $.each($(".chk-user"), function(i,item){
            if($(this).is(':checked')){
                var user_id = $("#tb-user").DataTable().row($(this).closest('tr')).data().S_ID;
                user_arr.push(user_id);
            }
        });
        saveGroupUserData('remove');
    });
})(jQuery, $.AdminLTE);