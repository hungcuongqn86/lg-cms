
(function ($, AdminLTE) {
    //get absolute path
    var loc = window.location;
    var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
    var absolutePath = loc.protocol + '//' + loc.host + pathName;
    //backend url
    var backendurl = absolutePath + 'modules/inc/inventory.php';

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
        $("#sl-form-type").val($("#sl-form-type option:first-child").val()).change();
        $("#sl-form-country").val('US').change();
        $("#txt-form-price").val('');
        $("#sl-form-currency").selectval('USD');
        $("#sl-form-state").selectval('approved');
        $("#div-price-problem").hide();
        
        $("#txt-form-price").focus();
        select_id = '';
    }

    //function edit data
    function editData(){
        $("#txt-form-price").focus();
        $("#div-price-problem").hide();
        $("#modal-form-loader").show();
        $.ajax({
            url: backendurl,
            type: "GET",
            dataType: 'json',
            data: {cmd: 'getShippingFeeDataById',
                    id: select_id},
            success: function (data) {
                $("#modal-form-loader").hide();
                if(data && data.result && data.result[0]) {                         
                    $("#sl-form-type").val(data.result[0].S_BASE_TYPE_ID).change();
                    $("#sl-form-country").val(data.result[0].S_COUNTRY_CODE).change();
                    $("#txt-form-price").val(data.result[0].S_PRICE);
                    $("#sl-form-currency").selectval(data.result[0].S_CURRENCY);
                    $("#sl-form-state").selectval(data.result[0].S_STATE);
                }
            },
            error: function () {
                openModalError();
            }
        });
    }

    //func save data
    function saveData(){
        if(!$.trim($("#txt-form-price").val())){
            $("#div-price-problem").show();
            return;
        }
        $("#modal-form-loader").show();
        $.ajax({
            url: backendurl,
            type: "POST",
            dataType: 'json',
            data: {cmd: 'saveShippingFeeData',
                id: select_id,
                type: $("#sl-form-type").val(),
                countrycode: $("#sl-form-country").val(),
                price: $("#txt-form-price").val(),
                currency: $("#sl-form-currency").val(),
                state: $("#sl-form-state").val()
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
            data: {cmd: 'removeShippingFeeData',
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
            type: "GET",
            dataType: 'json',
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

    //function get country combo
    function getCountryCombo(){
        $.ajax({
            url: backendurl,
            type: "GET",
            dataType: 'json',
            data: {cmd: 'getCountryCombo'},
            success: function (data) {
                if(data && data.result) { 
                    var xdata = [];                        
                    $.each(data.result, function(i,row){
                        xdata.push({id: row.S_ISO_ALPHA_CODE, text: row.S_ISO_ALPHA_CODE});
                                     
                    });
                    $("#sl-form-country").select2({
                        data: xdata,
                        placeholder: "Select a country"
                    });
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
            { 'orderable': false, 'width':'10px', 'targets': 4, 'defaultContent': edit_icon},
            { 'orderable': false,  'width':'10px', 'targets': 5, 'defaultContent': remove_icon},
            {'targets': 2,
                'data': null,
                'render': function ( data, type, full, meta ) {
                    var price = '';
                    if(data.S_PRICE) price = data.S_PRICE + " " + data.S_CURRENCY;
                    return price;
                }
            },
            {'targets': 3,
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
            url: backendurl + "?cmd=getShippingFeeData",
            data: function ( d ) {
                d.state = $("#option-filter-state").val();
            },
            error: function () {
                openModalError();
            }
        },
        'columns': [
            { "data": "TYPE_NAME" },
            { "data": "S_COUNTRY_CODE" },
            { "data": null },
            { "data": null },
            { "data": null },
            { "data": null }
        ],
        "fnDrawCallback" : function() {
            $('#tb-form-loader').hide();
        },
        processing: false
    });

    getTypeCombo();
    getCountryCombo();

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