Fulfillment.prototype.getOrderReportData = function () {
    var myjs = this;
    $.ajax({
        url: this.backendurl,
        type: "GET",
        dataType: 'json',
        data: {
            cmd: 'getPrintingReportData',
            startdate: this.date_start,
            enddate: this.date_end
        },
        success: function (data) {
            $('#report-pending').text(data[0]);
            $('#report-processing').text(data[1]);
            $('#report-confirm').text(data[2]);
            $('#report-fail').text(data[3]);
        },
        error: function () {
            openModalError();
        }
    });
};

Fulfillment.prototype.getOrderData = function () {
    var myjs = this;
    this.state = $('#sel-state').val();
    var searchtext = $('#search-text').val();
    this.startload($('#dataload'));
    $.ajax({
        url: this.backendurl,
        type: "GET",
        dataType: 'json',
        data: {
            cmd: 'getProductPrintingData',
            startdate: this.date_start,
            enddate: this.date_end,
            ssearch: searchtext,
            state: this.state,
            start: this.custom['start'],
            length: this.custom['length'],
            sordercol: this.custom['order'],
            sorderdir: this.custom['dir']
        },
        success: function (data) {
            myjs.data = data;
            myjs.genHeaderTableHtml();
            myjs.genBodyTableHtml();
            if (myjs.custom['fcol'] === 'checkbox') {
                $('#checkall').prop('checked', false).trigger('click');
                $('.form-render-submit').show();
            }
            myjs.endLoad($('#dataload'));
        },
        error: function () {
            myjs.endLoad($('#dataload'));
            openModalError();
        }
    });
};

Fulfillment.prototype.genHeaderTableHtml = function () {
    var myjs = this;
    var fcol = '#';
    if (this.custom['fcol'] === 'checkbox') {
        fcol = '<div class="checkbox checkbox-warning"><input type="checkbox" id="checkall" name="checkall"><label for="checkall"></label></div>';
    }
    var shtml = '<tr><th>' + fcol + '</th><th>Status</th><th>Order ID</th>' +
        '<th class="sort-col" id="S_PRODUCT_NAME" nowrap>Product name </th>';
    shtml += '<th nowrap>Front/Back product image </th>';
    shtml += '<th nowrap>Front/Back art </th>';
    if (this.custom['coldata'].includes('quantity')) {
        shtml += '<th class="sort-col" id="QUANTITY" nowrap>Quantity </th>';
    }
    if (this.custom['coldata'].includes('order-date')) {
        shtml += '<th class="sort-col" id="D_CREATE" nowrap>Order date </th>';
    }
    if (this.custom['coldata'].includes('due-date')) {
        shtml += '<th nowrap>Due date </th>';
    }
    shtml += '</tr>';
    $('table#tb-form thead').html('').append(shtml);
    $('.sort-col').unbind('click').click(function () {
        var val = $(this).attr('id');
        if (val === myjs.custom['order']) {
            if (myjs.custom['dir'] === 'asc') {
                myjs.custom['dir'] = 'desc';
            } else {
                myjs.custom['dir'] = 'asc';
            }
        } else {
            myjs.custom['order'] = val;
            myjs.custom['dir'] = 'asc';
        }
        myjs.getOrderData();
    }).each(function () {
        var val = $(this).attr('id');
        if (val === myjs.custom['order']) {
            if (myjs.custom['dir'] === 'asc') {
                $(this).append('<span><i class="ion-arrow-up-c"></i></span>');
            } else {
                $(this).append('<span><i class="ion-arrow-down-c"></i></span>');
            }
        } else {
            $(this).append('<span><i class="ion-arrow-up-c"></i><i class="ion-arrow-down-c"></i></span>');
        }
    });
    if (this.custom['fcol'] === 'checkbox') {
        $('#checkall').unbind('click').click(function () {
            myjs.custom['selected'] = [];
            if (this.checked) {
                $('.checkobjdata').prop('checked', true).each(function () {
                    var val = $(this).val();
                    myjs.custom['selected'].push(val);
                });
            } else {
                $('.checkobjdata').prop('checked', false);
            }
        });
    }
};

Fulfillment.prototype.genBodyTableHtml = function () {
    var myjs = this;
    var data = myjs.data.data;
    $('table#tb-form tbody').html('').append("<tr><td></td></tr>");
    $.each(data, function (index, row) {
        var shtml = '<tr>';
        var fcol = row.RNUM;
        if (myjs.custom['fcol'] === 'checkbox') {
            fcol = '<div class="checkbox checkbox-warning"><input type="checkbox" class="checkobjdata" id="check_' + row.S_ID + '" name="remember_me" value="' + row.S_ID + '"><label for="check_' + row.S_ID + '"></label></div>';
        }
        shtml += '<td>' + fcol + '</td>' +
            '<td><span class="state"><i style="color: ' + myjs.genStateColor(row.S_STATE) + '" class="ion-record"></i>' + myjs.genStateText(row.S_STATE) + '</span></td>' +
            '<td>' + row.S_ORDER_ID + '</td>' +
            '<td class="img-varial" prodprintingid="' + row.S_ID + '">' + row.S_PRODUCT_NAME + '</td>';
        shtml += '<td><span style="max-width: 80px;" class="img-campaign img-varial" prodprintingid="' + row.S_ID + '">';
        if (row.S_PRODUCT_FRONT_IMG_URL && row.S_PRODUCT_FRONT_IMG_URL !== '') {
            shtml += '<img style="width: 50%;background-color: #EEF1F7;" src="' + row.S_PRODUCT_FRONT_IMG_URL + '"/>';
        }
        if (row.S_PRODUCT_BACK_IMG_URL && row.S_PRODUCT_BACK_IMG_URL !== '') {
            shtml += '<img style="width: 50%;background-color: #FCFCFD;" src="' + row.S_PRODUCT_BACK_IMG_URL + '"/>';
        }
        shtml += '</span></td>';
        shtml += '<td><span style="max-width: 80px;" class="img-campaign img-design" prodprintingid="' + row.S_ID + '">';
        if (row.S_FRONT_IMAGE_URL && row.S_FRONT_IMAGE_URL !== '') {
            shtml += '<img style="width: 50%;background-color: #EEF1F7;" src="' + row.S_FRONT_IMAGE_URL + '"/>';
        }
        if (row.S_BACK_IMAGE_URL && row.S_BACK_IMAGE_URL !== '') {
            shtml += '<img style="width: 50%;background-color: #FCFCFD;" src="' + row.S_BACK_IMAGE_URL + '"/>';
        }
        shtml += '</span></td>';
        if (myjs.custom['coldata'].includes('quantity')) {
            shtml += '<td>' + row.N_QUANTITY + '</td>';
        }
        if (myjs.custom['coldata'].includes('order-date')) {
            shtml += '<td>' + row.DD_CREATE + '</td>';
        }
        if (myjs.custom['coldata'].includes('due-date')) {
            shtml += '<td>' + row.DUE_DATE + 'days</td>';
        }
        shtml += '</tr>';
        $('table#tb-form tbody tr:eq(' + index + ')').after(shtml);
    });
    $('table#tb-form tbody tr:eq(0)').remove();
    if (this.custom['fcol'] === 'checkbox') {
        $('.checkobjdata').unbind('click').click(function () {
            var val = $(this).val();
            if (this.checked) {
                myjs.custom['selected'].push(val);
            } else {
                var indexx = myjs.custom['selected'].indexOf(val);
                myjs.custom['selected'].splice(indexx, 1);
            }
        });
    }
    $('.img-varial').off('click').on('click', function (e) {
        modalDetail.openModalPrinting($(this).attr('prodprintingid'), 'printing-preview');
    });
    $('.img-design').off('click').on('click', function (e) {
        modalDetail.openModalPrinting($(this).attr('prodprintingid'), 'printing-design');
    });
    myjs.genPaginate();
};

Fulfillment.prototype.genPaginate = function () {
    var totalpage = Math.ceil(parseInt(this.data.recordsFiltered) / this.custom['length']);
    $('.total-page').html(totalpage);
    $('#num-page').attr('max', totalpage);
};

Fulfillment.prototype.genStateColor = function (state) {
    if (state === 'created') {
        return '#084e8a'
    }
    if (state === 'printing') {
        return '#1498ea'
    }
    if (state === 'printed') {
        return '#03be5b'
    }
    if (state === 'reject') {
        return '#d33131'
    }
    if (state === 'approved') {
        return '#03be5b'
    }
    return '#084e8a'
};

Fulfillment.prototype.genStateText = function (state) {
    if (state === 'created') {
        return 'Waiting for printing'
    }
    if (state === 'printing') {
        return 'Printing'
    }
    if (state === 'printed') {
        return 'Printed'
    }
    if (state === 'reject') {
        return 'Rejected'
    }
    if (state === 'approved') {
        return 'Approved'
    }
    return state
};

Fulfillment.prototype.getData = function () {
    this.getOrderReportData();
    this.getOrderData();
};

Fulfillment.prototype.setuporder = function () {
    var myjs = this;
    $('#chk-col-order').find(':checkbox').each(function () {
        $(this).click(function () {
            var val = $(this).val();
            if (this.checked) {
                myjs.custom['coldata'].push(val);
            } else {
                var indexx = myjs.custom['coldata'].indexOf(val);
                myjs.custom['coldata'].splice(indexx, 1);
            }
        });
    });

    $('#search-text').unbind('keypress').keypress(function (e) {
        if (e.keyCode === 13) {
            myjs.custom['start'] = 0;
            myjs.getData();
        }
    });

    $('#btn-order-apply').unbind('click').click(function () {
        myjs.genHeaderTableHtml();
        myjs.genBodyTableHtml();
        $('.dropdown-setting').removeClass('open');
    });

    $('#sel-row-of-page').unbind('change').change(function () {
        myjs.custom['start'] = 0;
        myjs.custom['length'] = $(this).val();
        myjs.getData();
    });

    $('#num-page').unbind('change').change(function () {
        var page = $(this).val();
        myjs.custom['start'] = (page - 1) * myjs.custom['length'];
        myjs.getData();
    });

    $('.toolbar-btn-pre').unbind('click').click(function () {
        var page = $('#num-page').val();
        if (page > 1) {
            page--;
            $('#num-page').val(page).trigger('change');
        }
    });

    $('.toolbar-btn-next').unbind('click').click(function () {
        var page = $('#num-page').val();
        var totalpage = Math.ceil(parseInt(myjs.data.recordsFiltered) / myjs.custom['length']);
        if (page < totalpage) {
            page++;
            $('#num-page').val(page).trigger('change');
        }
    });

    $('#sel-state').unbind('change').change(function () {
        myjs.custom['selected'] = [];
        myjs.custom['start'] = 0;
        myjs.custom['fcol'] = '#';
        $('#btn-print').prop("disabled", false);
        $('.form-render-submit').hide();
        myjs.getData();
    });

    $('#btn-print').unbind('click').click(function () {
        $('#sel-state').selectval('printed');
        obj_order.custom['fcol'] = 'checkbox';
        myjs.getData();
        $(this).prop("disabled", true);
    });

    $(".btn-sent").unbind('click').on('click', function (e) {
        if (myjs.custom['selected'].length < 1) {
            $("#p-print-problem").text('Please select row(s)').show();
            return false;
        }
        $("#p-print-problem").hide();
        $(".btn-form").addClass("disabled");
        myjs.startload($('#dataload'));
        var state = $(this).attr('id');
        $.ajax({
            url: myjs.backendurl,
            type: "POST",
            dataType: 'json',
            data: {
                cmd: 'acceptProductPrintData_Management',
                prod_print_arr: myjs.custom['selected'],
                info: $("#txt-form-info").val(),
                state: state
            },
            success: function (data) {
                $(".btn-form").removeClass("disabled");
                if (data && data.result) {
                    myjs.getOrderData();
                    $("#lb-count-product").html(myjs.custom['selected'].length);
                    $('#modal-print').modal('show');
                }
                myjs.endLoad($('#dataload'));
            },
            error: function () {
                $(".btn-form").removeClass("disabled");
                myjs.endLoad($('#dataload'));
                openModalError();
            }
        });
    });

    $('#btn-refresh').unbind('click').click(function () {
        myjs.getData();
    });
};

var obj_order = new Fulfillment();
(function ($, AdminLTE) {
    obj_order.custom['selected'] = [];
    obj_order.custom['start'] = 0;
    obj_order.custom['length'] = 10;
    obj_order.custom['coldata'] = ['quantity', 'order-date', 'due-date'];
    obj_order.custom['fcol'] = '#';
    obj_order.custom['order'] = 'D_CREATE';
    obj_order.custom['dir'] = 'desc';
    obj_order.init('subprinting');
    obj_order.setuporder();
    modalDetail.init('printing');
})(jQuery, $.AdminLTE);