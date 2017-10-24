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
            cmd: 'getCampaignOrderData',
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
    if (state === 'processing') {
        return '#084e8a'
    }
    if (state === 'wait_for_print') {
        return '#1498ea'
    }
    if (state === 'wait_for_shipping') {
        return '#03be5b'
    }
    if (state === 'shipping') {
        return '#03be5b'
    }
    if (state === 'delivered') {
        return '#03be5b'
    }
    return '#084e8a'
};

Fulfillment.prototype.genStateText = function (state) {
    if (state === 'processing') {
        return 'Processing'
    }
    if (state === 'wait_for_print') {
        return 'Wait for print'
    }
    if (state === 'wait_for_shipping') {
        return 'Wait for shipping'
    }
    if (state === 'shipping') {
        return 'Shipping'
    }
    if (state === 'delivered') {
        return 'Delivered'
    }
    return state
};

Fulfillment.prototype.getData = function () {
    this.getOrderReportData();
    this.getOrderData();
};

Fulfillment.prototype.getPrinter = function (id) {
    var myjs = this;
    myjs.startload($('#dataload'));
    $.ajax({
        url: this.backendurl,
        type: "GET",
        dataType: 'json',
        data: {
            cmd: 'getSignPartnerData',
            id: id
        },
        success: function (data) {
            myjs.custom['printer'] = data[0];
            myjs.endLoad($('#dataload'));
        },
        error: function () {
            myjs.endLoad($('#dataload'));
            openModalError();
        }
    });
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
        $('#sel-state').selectval('processing');
        obj_order.custom['fcol'] = 'checkbox';
        myjs.getData();
        $(this).prop("disabled", true);
    });

    $('#sel-printer').select2({
        placeholder: 'Select a partner',
        ajax: {
            url: myjs.backendurl + "?cmd=searchPartnerData",
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
    }).on("select2:select", function () {
        myjs.getPrinter($(this).val());
    });

    $("#btn-sent").unbind('click').on('click', function (e) {
        if (myjs.custom['selected'].length < 1) {
            $("#p-print-problem").text('Please select campaign order(s)').show();
            return false;
        }
        if (!$("#sel-printer").val()) {
            $("#p-print-problem").text('Please select a partner').show();
            return false;
        }
        $("#p-print-problem").hide();

        var data = myjs.data.data;
        var totalquality = 0;
        $.each(data, function (index, row) {
            if (myjs.custom['selected'].includes(row.S_ID)) {
                totalquality += parseInt(row.N_QUANTITY);
            }
        });

        var today = new Date();
        var confirminf = '<p><span style="width: 40%; display: inline-block;">Total number of order</span><strong>' +
            myjs.custom['selected'].length.toString() + '</strong></p> ' +
            '<p><span style="width: 40%; display: inline-block;">Total number of product</span><strong>' + totalquality + '</strong></p> ' +
            '<p><span style="width: 40%; display: inline-block;">Submitted date</span><strong>' + today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear() + '</strong></p> ' +
            '<p><span style="width: 40%; display: inline-block;">Due date</span><strong>' + data[0].DUE_DATE + '</strong></p> ' +
            '<p><span style="width: 40%; display: inline-block;">PrintShop</span><strong>' + myjs.custom['printer'].S_NAME + '</strong></p> ' +
            '<p><span style="width: 40%; display: inline-block;">Contact</span><strong>' + myjs.custom['printer'].S_INFO + '</strong></p> ' +
            '<p><span style="width: 40%; display: inline-block;">Submitted by</span><strong>' + $('#loginuser').text() + '</strong></p>';
        $('#confirminf').html(confirminf);
        $('#modal-confirm-print').modal('show');
        return false;
    });

    $('#btn-submit').unbind('click').click(function () {
        $(".btn-form").addClass("disabled");
        myjs.startload($('#dataload'));
        $.ajax({
            url: myjs.backendurl,
            type: "POST",
            dataType: 'json',
            data: {
                cmd: 'printCampaignOrderData',
                campaign_order_arr: myjs.custom['selected'],
                partnerid: $("#sel-printer").val()
            },
            success: function (data) {
                $(".btn-form").removeClass("disabled");
                if (data && data.result) {
                    myjs.getOrderData();
                    $("#lb-count-product").html(myjs.custom['selected'].length);
                    $('#modal-confirm-print').modal('hide');
                    $('#modal-print').modal('show');
                }
                myjs.endLoad($('#dataload'));
            },
            error: function () {
                $(".btn-form").removeClass("disabled");
                myjs.endLoad($('#dataload'));
                $('#modal-confirm-print').modal('hide');
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
    obj_order.custom['printer'] = {};
    obj_order.custom['start'] = 0;
    obj_order.custom['length'] = 10;
    obj_order.custom['coldata'] = ['quantity', 'order-date', 'due-date'];
    obj_order.custom['fcol'] = '#';
    obj_order.custom['order'] = 'D_CREATE';
    obj_order.custom['dir'] = 'desc';
    obj_order.init('subprinting');
    obj_order.setuporder();
    modalDetail.init('print');
})(jQuery, $.AdminLTE);