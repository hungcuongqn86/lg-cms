
(function ($, AdminLTE) {
    //get absolute path
    var loc = window.location;
    var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
    var absolutePath = loc.protocol + '//' + loc.host + pathName;
    //backend url
    var backendurl = absolutePath + 'modules/inc/inventory.php';

    var select_id = '';

    $('.select-box').selectctr();

    $("#div-color-picker").colorpicker();

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
        ("#txt-form-name").val('');
        $("#txt-form-desc").val('');
        $("#txt-form-position").val('');
        $("#txt-form-value").val('#ffffff');
        $("#sl-form-state").selectval('approved');
        
        $("#txt-form-name").focus();
        select_id = '';
    }

    //function edit data
    function editData(){
        $("#txt-form-name").focus();
        $("#modal-form-loader").show();
        $.ajax({
            url: backendurl,
            type: "GET",
            dataType: 'json',
            data: {cmd: 'getBaseColorDataById',
                    id: select_id},
            success: function (data) {
                $("#modal-form-loader").hide();
                if(data && data.result && data.result[0]) {                         
                    $("#txt-form-name").val(data.result[0].S_NAME);
                    $("#txt-form-desc").val(data.result[0].S_DESC);
                    $("#txt-form-position").val(data.result[0].N_POSITION);
                    $("#txt-form-value").val(data.result[0].S_VALUE);
                    $("#sl-form-state").selectval(data.result[0].S_STATE);
                    $("#div-color-picker").colorpicker('setValue', data.result[0].S_VALUE);
                }
            },
            error: function () {
                openModalError();
            }
        });
    }

    //func save data
    function saveData(){
        $("#modal-form-loader").show();
        $.ajax({
            url: backendurl,
            type: "POST",
            dataType: 'json',
            data: {cmd: 'saveBaseColorData',
                id: select_id,
                name: $("#txt-form-name").val(),
                desc: $("#txt-form-desc").val(),
                value: $("#txt-form-value").val(),
                position: $("#txt-form-position").val(),
                state: $("#sl-form-state").val()
            },
            success: function (data) {
                $("#modal-form-loader").hide();
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
            data: {cmd: 'removeBaseColorData',
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
            { 'orderable': false, 'width':'10px', 'targets': 7, 'defaultContent': edit_icon},
            { 'orderable': false,  'width':'10px', 'targets': 8, 'defaultContent': remove_icon},
            {'targets': 2,
                'data': null,
                'render': function ( data, type, full, meta ) {
                    var value_data = '<table><tr><td width="100%">'+data.S_VALUE+'</td><td><div style="width:20px;height:20px;background-color:'+data.S_VALUE+'"></div></td></tr></table>';
                    return value_data;
                }
            },
            {'targets': 4,
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
        'aaSorting': [[3, 'asc']],
        'processing': true,
        'serverSide': true,
        'ajax':{
            url: backendurl + "?cmd=getBaseColorData",
            data: function ( d ) {
                d.state = $("#option-filter-state").val();
            },
            error: function () {
                openModalError();
            }
        },
        'columns': [
            { "data": "S_NAME" },
            { "data": "S_DESC" },
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

})(jQuery, $.AdminLTE);