
(function ($, AdminLTE) {
    //get absolute path
    var loc = window.location;
    var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
    var absolutePath = loc.protocol + '//' + loc.host + pathName;
    //backend url
    var backendurl = absolutePath + 'modules/inc/setup.php';

    var select_id = '';

    var parent_id = '';

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
        $("#sl-form-state").selectval('approved');
        $('#chk-form-visible').prop('checked',true);
        $("#lb-form-url").html('');
        $("#txt-form-url").val('');
        $("#txt-form-url").show();
        $("#div-form-domain").show();
        $("#div-name-problem").hide();
        
        $("#txt-form-name").focus();
        select_id = '';
    }

    //function edit data
    function editData(){
        $("#txt-form-name").focus();
        $("#txt-form-url").hide();
        $("#lb-form-url").show();
        $("#div-form-domain").hide();
        $("#div-name-problem").hide();
        $("#modal-form-loader").show();
        $.ajax({
            url: backendurl,
            type: "GET",
            dataType: 'json',
            data: {cmd: 'getCategoryDataById',
                    id: select_id},
            success: function (data) {
                $("#modal-form-loader").hide();
                if(data && data.result && data.result[0]) {                         
                    $("#lb-form-parent").html(data.result[0].S_PARENT_NAME);
                    $("#txt-form-name").val(data.result[0].S_NAME);
                    $("#txt-form-desc").val(data.result[0].S_DESC);
                    $("#sl-form-state").selectval(data.result[0].S_STATE);
                    if(data.result[0].N_VISIBLE == 1) $('#chk-form-visible').prop('checked',true);
                    else $('#chk-form-visible').prop('checked',false);
                    $("#lb-form-url").html(data.result[0].CATEGORY_URL);     
                }
            },
            error: function () {
                openModalError();
            }
        });
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
            data: {cmd: 'saveCategoryData',
                id: select_id,
                parentid: parent_id,
                name: $("#txt-form-name").val(),
                desc: $("#txt-form-desc").val(),
                visible: ($('#chk-form-visible').is(':checked')?1:0),
                state: $("#sl-form-state").val(),
                url: $("#txt-form-url").val(),
                domain: $("#sl-form-domain").val()
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
            data: {cmd: 'removeCategoryData',
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

    //function get domain combo
    function getDomainCombo(){
        $.ajax({
            url: backendurl,
            type: "GET",
            dataType: 'json',
            data: {cmd: 'getDomainCombo'},
            success: function (data) {
                if(data && data.result) { 
                    var xdata = [];                        
                    $.each(data.result, function(i,row){
                        xdata.push({id: row.S_ID, text: row.S_NAME});
                                     
                    });
                    $("#sl-form-domain").select2({
                        data: xdata
                    });                       
                }
            },
            error: function () {
                openModalError();
            }
        });
    }

    //function check exist url
    var add_number = 0;
    function checkExistURL(){
        $.ajax({
            url: backendurl,
            type: "GET",
            dataType: 'json',
            data: {cmd: 'checkExistURL',
                   url: $('#txt-form-url').val()
                  },
            success: function (data) {
                if(data && data.result) { 
                    add_number ++;
                    $('#txt-form-url').val($('#txt-form-url').val() + add_number); 
                    checkExistURL();                      
                }
                else{
                    add_number = 0;
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
    var open_icon = '<a href="javascript:void(0)" class="i-form-open" ><i class="i-form ion-forward" title="Open children"></i></a>';
    var table1 = $("#tb-form").DataTable({
        'columnDefs': [
            { 'orderable': false, 'width':'10px', 'targets': 7, 'defaultContent': open_icon},
            { 'orderable': false, 'width':'10px', 'targets': 8, 'defaultContent': edit_icon},
            { 'orderable': false,  'width':'10px', 'targets': 9, 'defaultContent': remove_icon},
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
        'aaSorting': [[0, 'asc']],
        'processing': true,
        'serverSide': true,
        'ajax':{
            url: backendurl + "?cmd=getCategoryData",
            data: function ( d ) {
                d.parent_id = parent_id;
                d.state = $("#option-filter-state").val();
            },
            error: function () {
                openModalError();
            }
        },
        'columns': [
            { "data": "S_NAME" },
            { "data": "PARENT_NAME" },
            { "data": "S_DESC" },
            { "data": "N_VISIBLE" },
            { "data": null },
            { "data": "DD_CREATE" },
            { "data": "DD_UPDATE" },
            { "data": null },
            { "data": null },
            { "data": null }
        ],
        "fnDrawCallback" : function() {
            $('#tb-form-loader').hide();
        },
        processing: false
    });

    getDomainCombo();

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
        $('.i-form-open').off('click').on('click', function (e) {
            parent_id = table1.row(this.closest('tr')).data().S_ID;
            parent_title = table1.row(this.closest('tr')).data().S_NAME;
            getData();
            $("#lb-form-parent").html(parent_title);
            $("#div-category-list").append('<span id="sp_'+parent_id+'">&nbsp;&nbsp;<i class="fa fa-angle-right"></i>&nbsp;&nbsp;<a class="a-category-list" href="#" sid='+parent_id+'>'+parent_title+'</a></span>');

            $('.a-category-list').off('click');
            $(".a-category-list").on('click', function (e) {
                parent_id = $(this).attr('sid');
                $("#lb-form-parent").html($(this).html());
                removeList($("#sp_"+parent_id));
                getData();
            });
        });
    });

    function removeList(obj){
        if(obj.next().length) removeList(obj.next());
        obj.next().remove();
    }

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

    $('#txt-form-name').on( 'keyup', function () {
        if(select_id == ''){
            $('#txt-form-url').val('category-'+$('#txt-form-name').val());
            checkExistURL();
        }
    });
    $('#txt-form-url').on( 'keyup', function () {
        if(select_id == ''){
            checkExistURL();
        }
    });
})(jQuery, $.AdminLTE);