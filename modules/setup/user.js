
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

    //function add new
    function addNew(){
        $('#modal-form').modal('show');
        $('#modal-form').each(reposition);

        $('.nav-tabs a[href="#tab1"]').tab('show');
        $("#lb-form-saved").hide();
        $("#txt-form-name").val('');
        $("#txt-form-email").val('');
        $("#txt-form-password").val('');
        $("#txt-form-referer").val('');
        $("#txt-form-source").selectval('general');
        $("#sl-form-state").selectval('approved');
        $("#txt-form-avatar").val('');
        $("#img-avatar").attr("src","");

        $("#txt-form-mobile").val('');
        $("#txt-form-line1").val('');
        $("#txt-form-line2").val('');
        $("#txt-form-city").val('');
        $("#txt-form-poscode").val('');

        $("#sl-form-country").val('').change();
        $('#sl-form-addr-state').empty();
        $("#sl-form-language").val('').change();
        $("#sl-form-timezone").val('').change();
        $("#sl-form-partner").val('').change();

        $("#sl-form-payment-state").selectval('approved');
        $("#sl-form-payment-default").selectval('paypal');
        $('input:radio[name=radio-payment-default]').filter('[value=paypal]').prop('checked',true);
        $("#txt-form-payment-paypal-email").val('');
        $("#txt-form-payment-paypal-firstname").val('');
        $("#txt-form-payment-paypal-lastname").val('');

        $("#txt-form-payment-payoneer-email").val('');

        $("#txt-form-payment-wiretransfer-accountname").val('');
        $("#txt-form-payment-wiretransfer-accountnumber").val('');
        $("#txt-form-payment-wiretransfer-routingnumber").val('');
        $("#sl-form-payment-wiretransfer-country").val('').change();

        $("#div-changepw-button").hide();
        $("#div-changepw-text").show();
        $("#txt-form-password").val('');

        $('.nav-tabs a[href="#tab4"]').parent().hide();
        
        $("#txt-form-name").focus();
        select_id = '';
    }

    //function edit data
    function editData(){
        $("#txt-form-name").focus();
        $("#div-changepw-button").show();
        $("#div-changepw-text").hide();
        $.ajax({
            url: backendurl,
            type: "GET",
            dataType: 'json',
            data: {cmd: 'getUserDataById',
                    id: select_id},
            success: function (data) {
                $("#modal-form-loader").hide();
                $('.nav-tabs a[href="#tab4"]').parent().hide();
                if(data && data.result && data.result[0]) {                         
                    $("#txt-form-name").val(data.result[0].S_NAME);
                    $("#txt-form-email").val(data.result[0].S_EMAIL);
                    $("#txt-form-referer").val(data.result[0].S_REFERER);
                    $("#txt-form-source").val(data.result[0].S_SOURCE);
                    $("#sl-form-state").selectval(data.result[0].S_STATE);
                    $("#txt-form-avatar").val(data.result[0].S_AVATAR);
                    $("#img-avatar").attr("src",data.result[0].S_AVATAR);

                    $("#txt-form-mobile").val(data.result[0].S_MOBILE);
                    $("#txt-form-line1").val(data.result[0].S_ADDR_LINE1);
                    $("#txt-form-line2").val(data.result[0].S_ADDR_LINE2);
                    $("#txt-form-city").val(data.result[0].S_ADDR_CITY);
                    $("#txt-form-poscode").val(data.result[0].S_ADDR_POS_CODE);
                    
                    $("#sl-form-country").val(data.result[0].S_ADDR_COUNTRY).change();
                    getStateCombo(data.result[0].S_ADDR_STATE);
                    $("#sl-form-language").val(data.result[0].S_LANGUAGE_ID).change();
                    $("#sl-form-timezone").val(data.result[0].S_TIMEZONE).change();
                    if(data.result[0].S_PARTNER_ID)
                        $("#sl-form-partner").append('<option value="'+data.result[0].S_PARTNER_ID+'">'+data.result[0].PARTNER_NAME+'</option>').val(data.result[0].S_PARTNER_ID).change();
                    else
                        $("#sl-form-partner").val('').change();
                    if(data.result[0].S_STATE && data.result[0].S_STATE == 'authorization_required'){
                        $('.nav-tabs a[href="#tab4"]').parent().show();
                        getAuthorizationData();
                    }
                    else if($('.nav-tabs a[href="#tab4"]').parent().hasClass("active")){
                        $('.nav-tabs a[href="#tab1"]').tab('show');
                    }
                }
            },
            error: function () {
                openModalError();
            }
        });
        getPaymentData();
    }

    //func save data
    function saveData(){
        $("#modal-form-loader").show();
        $.ajax({
            url: backendurl,
            type: "POST",
            dataType: 'json',
            data: {cmd: 'saveUserData',
                id: select_id,
                name: $("#txt-form-name").val(),
                email: $("#txt-form-email").val(),
                password: ($("#div-changepw-text").is(":visible"))?$("#txt-form-password").val():"",
                referer: $("#txt-form-referer").val(),
                source: $("#txt-form-source").val(),
                state: $("#sl-form-state").val(),
                avatar: $("#txt-form-avatar").val(),
                mobile: $("#txt-form-mobile").val(),
                line1: $("#txt-form-line1").val(),
                line2: $("#txt-form-line2").val(),
                city: $("#txt-form-city").val(),
                poscode: $("#txt-form-poscode").val(),
                addr_state: $("#sl-form-addr-state").val(),
                country: $("#sl-form-country").val(),
                language: $("#sl-form-language").val(),
                timezone: $("#sl-form-timezone").val(),
                partnerid: $("#sl-form-partner").val()
                  },
            success: function (data) {
                $("#modal-form-loader").hide();
                $("#div-name-problem").hide();
                if(data && data.result) {
                    select_id = data.result;
                }
                savePaymentData();
                if($('.nav-tabs a[href="#tab4"]').parent().is(":visible")){
                    saveAuthorizationData();
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
            data: {cmd: 'removeUserData',
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

    //function get country combo
    function getCountryCombo(){
        $.ajax({
            url: backendurl,
            type: "GET", //GET, POST, PUT, DELETE
            dataType: 'json',
            //contentType: 'application/json',
            data: {cmd: 'getCountryCombo'},
            success: function (data) {
                if(data && data.result) { 
                    var xdata = [];                        
                    $.each(data.result, function(i,row){
                        xdata.push({id: row.S_ID, text: row.S_NAME});
                                     
                    });
                    $("#sl-form-country").select2({
                        data: xdata,
                        placeholder: "Select a country"
                    }); 
                    $("#sl-form-payment-wiretransfer-country").select2({
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

    //function get state combo
    function getStateCombo(selected){
        $.ajax({
            url: backendurl,
            type: "GET", //GET, POST, PUT, DELETE
            dataType: 'json',
            //contentType: 'application/json',
            data: {cmd: 'getStateCombo',
                   country: $("#sl-form-country").val()
                  },
            success: function (data) {
                $('#sl-form-addr-state').empty();
                if(data && data.result) { 
                    var xdata = [];                        
                    $.each(data.result, function(i,row){
                        xdata.push({id: row.S_ID, text: row.S_NAME});
                                     
                    });
                    $("#sl-form-addr-state").select2({
                        data: xdata,
                        placeholder: "Select a state"
                    }); 
                    $("#sl-form-addr-state").val(selected).change();
                }
            },
            error: function () {
                openModalError();
            }
        });
    }

    //function get language combo
    function getLanguageCombo(){
        $.ajax({
            url: backendurl,
            type: "GET", //GET, POST, PUT, DELETE
            dataType: 'json',
            //contentType: 'application/json',
            data: {cmd: 'getLanguageCombo'},
            success: function (data) {
                if(data && data.result) { 
                    var xdata = [];                        
                    $.each(data.result, function(i,row){
                        xdata.push({id: row.S_ID, text: row.S_NAME});
                                     
                    });
                    $("#sl-form-language").select2({
                        data: xdata,
                        placeholder: "Select a language"
                    }); 
                }
            },
            error: function () {
                openModalError();
            }
        });
    }
    //function get timezone combo
    function getTimezoneCombo(){
        $.ajax({
            url: backendurl,
            type: "GET", //GET, POST, PUT, DELETE
            dataType: 'json',
            //contentType: 'application/json',
            data: {cmd: 'getTimezoneCombo'},
            success: function (data) {
                if(data && data.result) { 
                    var xdata = [];                        
                    $.each(data.result, function(i,row){
                        xdata.push({id: row.S_ID, text: row.S_NAME + " " + row.S_UTC});
                                     
                    });
                    $("#sl-form-timezone").select2({
                        data: xdata,
                        placeholder: "Select a timezone"
                    }); 
                }
            },
            error: function () {
                openModalError();
            }
        });
    }

    //function get payment data
    function getPaymentData(){
        $.ajax({
            url: backendurl,
            type: "GET",
            dataType: 'json',
            data: {cmd: 'getPaymentData',
                   userid: select_id},
            success: function (data) {
                $("#sl-form-payment-state").selectval('approved');
                $("#sl-form-payment-default").selectval('paypal');
                $('input:radio[name=radio-payment-default]').filter('[value=paypal]').prop('checked',true);
                $("#txt-form-payment-paypal-email").val('');
                $("#txt-form-payment-paypal-firstname").val('');
                $("#txt-form-payment-paypal-lastname").val('');

                $("#txt-form-payment-payoneer-email").val('');

                $("#txt-form-payment-wiretransfer-accountname").val('');
                $("#txt-form-payment-wiretransfer-accountnumber").val('');
                $("#txt-form-payment-wiretransfer-routingnumber").val('');
                $("#sl-form-payment-wiretransfer-country").val('').change();
                if(data && data.result && data.result[0]) {                         
                    $("#sl-form-payment-state").selectval(data.result[0].S_STATE);
                    $("#sl-form-payment-default").selectval(data.result[0].S_DEFAULT);
                    $('input:radio[name=radio-payment-default]').filter('[value='+data.result[0].S_DEFAULT+']').prop('checked',true);
                    $("#txt-form-payment-paypal-email").val(data.result[0].S_PAYPAL_EMAIL);
                    $("#txt-form-payment-paypal-firstname").val(data.result[0].S_PAYPAL_FIRSTNAME);
                    $("#txt-form-payment-paypal-lastname").val(data.result[0].S_PAYPAL_LASTNAME);

                    $("#txt-form-payment-payoneer-email").val(data.result[0].S_PAYONEER_EMAIL);

                    $("#txt-form-payment-wiretransfer-accountname").val(data.result[0].S_WIRE_ACCOUNT_NAME);
                    $("#txt-form-payment-wiretransfer-accountnumber").val(data.result[0].S_WIRE_ACCOUNT_NUMBER);
                    $("#sl-form-payment-wiretransfer-country").val(data.result[0].S_WIRE_COUNTRY).change();
                    $("#txt-form-payment-wiretransfer-routingnumber").val(data.result[0].S_WIRE_ROUTING_NUMBER);
                }
            },
            error: function () {
                openModalError();
            }
        });
    }

    //function save payment data
    function savePaymentData(){
        $.ajax({
            url: backendurl,
            type: "POST",
            dataType: 'json',
            data: {cmd: 'savePaymentData',
                   userid: select_id,
                   default: $("#sl-form-payment-default").val(),
                   state: $("#sl-form-payment-state").val(),
                   paypal_email: $("#txt-form-payment-paypal-email").val(),
                   paypal_firstname: $("#txt-form-payment-paypal-firstname").val(),
                   paypal_lastname: $("#txt-form-payment-paypal-lastname").val(),
                   payoneer_email: $("#txt-form-payment-payoneer-email").val(),
                   wiretransfer_accountname: $("#txt-form-payment-wiretransfer-accountname").val(),
                   wiretransfer_accountnumber: $("#txt-form-payment-wiretransfer-accountnumber").val(),
                   wiretransfer_routingnumber: $("#txt-form-payment-wiretransfer-routingnumber").val(),
                   wiretransfer_country: $("#sl-form-payment-wiretransfer-country").val()
                  },
            success: function (data) {
                if(data && data.result) {
                    
                }
            },
            error: function () {
                openModalError();
            }
        });
    }

    //function get authorization data
    function getAuthorizationData(){
        $.ajax({
            url: backendurl,
            type: "GET",
            dataType: 'json',
            data: {cmd: 'getAuthorizationData',
                   userid: select_id},
            success: function (data) {
                $("#sl-form-authorization-state").selectval('approved');
                $('#timepicker-authorization-expire').data("DateTimePicker").date(Date.parse($('#curr-server-date').val()));
                $("#lb-form-authorization-type").html('');
                $("#lb-form-authorization-value").html('');
                $("#lb-form-authorization-activationcode").html('');
                $("#lb-form-authorization-create").html('');
                $("#lb-form-authorization-update").html('');
                if(data && data.result && data.result[0]) {                         
                    $("#sl-form-authorization-state").selectval(data.result[0].S_STATE);
                    $('#timepicker-authorization-expire').data("DateTimePicker").date(data.result[0].DD_EXPIRE);
                    $("#lb-form-authorization-type").html(data.result[0].S_TYPE);
                    $("#lb-form-authorization-value").html(data.result[0].S_VALUE);
                    $("#lb-form-authorization-activationcode").html(data.result[0].S_ACTIVATION_CODE);
                    $("#lb-form-authorization-create").html(data.result[0].DD_CREATE);
                    $("#lb-form-authorization-update").html(data.result[0].DD_UPDATE);
                }
            },
            error: function () {
                openModalError();
            }
        });
    }

    //function save authorization data
    function saveAuthorizationData(){
        $.ajax({
            url: backendurl,
            type: "POST",
            dataType: 'json',
            data: {cmd: 'saveAuthorizationData',
                   userid: select_id,
                   state: $("#sl-form-authorization-state").val(),
                   expire: $("#timepicker-authorization-expire").find("input").val()
                  },
            success: function (data) {
                if(data && data.result) {
                    
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
            { 'orderable': false, 'width':'10px', 'targets': 6, 'defaultContent': edit_icon},
            { 'orderable': false,  'width':'10px', 'targets': 7, 'defaultContent': remove_icon},
            {'targets': 2, 'orderable': false,
                'data': null,
                'render': function ( data, type, full, meta ) {
                var avatar = '';
                if(data.S_AVATAR) avatar = '<img src="'+data.S_AVATAR+'" width="50"/>';
                return avatar;
                }
            },
            {'targets': 3,
                'data': null,
                'render': function ( data, type, full, meta ) {
                var state = '';
                if(data.S_STATE == 'approved') state = '<div class="color-list"><div class="color color-status" style="background-color:#03be5b"></div>Approved</div>';
                if(data.S_STATE == 'authorization_required') state = '<div class="color-list"><div class="color color-status" style="background-color:#1498ea"></div>Authorization required</div>';
                if(data.S_STATE == 'locked') state = '<div class="color-list"><div class="color color-status" style="background-color:#9fa3a7 "></div>Locked</div>';
                if(data.S_STATE == 'deleted') state = '<div class="color-list"><div class="color color-status" style="background-color:#ed6347"></div>Deleted</div>';
                return state;
                }
            },
            ],
        'aaSorting': [[4, 'desc']],
        'processing': true,
        'serverSide': true,
        'ajax':{
            url: backendurl + "?cmd=getUserData",
            data: function ( d ) {
                d.state = $("#option-filter-state").val();
                d.startdate = date_start;
                d.enddate = date_end;
            },
            error: function () {
                openModalError();
            }
        },
        'columns': [
            { "data": "S_NAME" },
            { "data": "S_EMAIL" },
            { "data": null },
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
    getCountryCombo();
    getLanguageCombo();
    getTimezoneCombo();
    $("#sl-form-partner").select2({
        placeholder: 'Select a partner',
        ajax: {
            url: backendurl + "?cmd=searchPartnerData",
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term,
                    page: params.page
                };
            },
            processResults: function (data, params) {
                params.page = params.page || 1;
                return {
                    results: data.items,
                    pagination: {
                        more: (params.page * 10) < data.total
                    }
                };
            },
            cache: true
        }
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

    $("#sl-form-country").on('change', function(){
        getStateCombo();
    });

    $('#timepicker-authorization-expire').datetimepicker({
        format: 'DD/MM/YYYY h:mm A'
    });

    $('input[name="radio-payment-default"]').on('change', function(){
        $('.payment-paypal').hide();
        $('.payment-payoneer').hide();
        $('.payment-wiretransfer').hide();
        if($(this).val() == 'paypal') $('.payment-paypal').show();
        if($(this).val() == 'payoneer') $('.payment-payoneer').show();
        if($(this).val() == 'wire_transfer') $('.payment-wiretransfer').show();
    });

    $('#btn-change-pw').on( 'click', function () {
        $("#div-changepw-text").show();
        $("#txt-form-password").val('');
        $("#txt-form-password").focus();
    });

})(jQuery, $.AdminLTE);