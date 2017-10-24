Fulfillment.prototype.getOrderReportData = function () {
    var myjs = this;
    $.ajax({
        url: this.backendurl,
        type: "GET",
        dataType: 'json',
        data: {
            cmd: 'getOrderReportData',
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
            cmd: 'getOrderData',
            userid: this.custom['user'],
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
    var shtml = '<tr><th>#</th><th></th><th>Status</th><th>Order ID</th>' +
        '<th class="sort-col" id="CAMPAIGN" nowrap>Campaign </th>';
    if (this.custom['coldata'].includes('quantity')) {
        shtml += '<th class="sort-col" id="QUANTITY" nowrap>Quantity </th>';
    }
    if (this.custom['coldata'].includes('amount')) {
        shtml += '<th class="sort-col" id="AMOUNT" nowrap>Amount </th>';
    }
    if (this.custom['coldata'].includes('order-date')) {
        shtml += '<th class="sort-col" id="CREATE-DATE" nowrap>Order date </th>';
    }
    if (this.custom['coldata'].includes('update')) {
        shtml += '<th class="sort-col" id="UPDATE-DATE" nowrap>Update </th>';
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
};

Fulfillment.prototype.genBodyTableHtml = function () {
    var myjs = this;
    var data = myjs.data.data;
    $('table#tb-form tbody').html('').append("<tr><td></td></tr>");
    $.each(data, function (index, row) {
        var arrcampaign = row.CAMPAIGN.split('#$#');
        var campaign = [];
        $.each(arrcampaign, function (index, item) {
            var indexx = campaign.indexOf(item);
            if (indexx < 0) {
                campaign.push(item);
            }
        });

        var shtml = '<tr>';
        shtml += '<td>' + row.RNUM + '</td>' +
            '<td class="act-order-product" id="' + row.S_ID + '" style="cursor:pointer;"><i class="plus ion-ios-plus-outline"></i></td>' +
            '<td><span class="state"><i style="color: ' + myjs.genStateColor(row.S_STATE) + '" class="ion-record"></i>' + myjs.genStateText(row.S_STATE) + '</span></td>' +
            '<td>' + row.S_ID + '</td>' +
            '<td class="data-hl">' + campaign.join(', ') + '</td>';

        if (myjs.custom['coldata'].includes('quantity')) {
            shtml += '<td>' + row.PRODUCT_QUANTITY + '</td>';
        }
        if (myjs.custom['coldata'].includes('amount')) {
            shtml += '<td>$' + row.S_AMOUNT + '</td>';
        }
        if (myjs.custom['coldata'].includes('order-date')) {
            shtml += '<td>' + row.DD_CREATE + '</td>';
        }
        if (myjs.custom['coldata'].includes('update')) {
            shtml += '<td>' + row.DD_UPDATE + '</td>';
        }
        shtml += '</tr>';
        $('table#tb-form tbody tr:eq(' + index + ')').after(shtml);
    });
    $('table#tb-form tbody tr:eq(0)').remove();
    myjs.genPaginate();
    $('.act-order-product').unbind('click').click(function () {
        myjs.getOrderProductData(this);
    });
};

Fulfillment.prototype.genPaginate = function () {
    var totalpage = Math.ceil(parseInt(this.data.recordsFiltered) / this.custom['length']);
    $('.total-page').html(totalpage);
    $('#num-page').attr('max', totalpage);
};

Fulfillment.prototype.getOrderProductData = function (td) {
    var myjs = this;
    var row = $(td).parent();
    var index = $('table#tb-form tbody tr').index(row);
    var orderid = $(td).attr('id');
    var checkhas = $('table#tb-form tbody tr:eq(' + index + ')').attr('d');
    if (checkhas !== '1') {
        $('.act-order-product').unbind('click');
        this.startload($('#dataload'));
        $.ajax({
            url: this.backendurl,
            type: "GET",
            dataType: 'json',
            data: {
                cmd: 'getOrderProductData',
                orderid: orderid
            },
            success: function (data) {
                $('table#tb-form tbody tr.data-product').hide();
                $.each(data, function (i, row) {
                    var imgurl = row.VARIANT_FRONT;
                    if (row.BACK_VIEW === '1') {
                        imgurl = row.VARIANT_BACK;
                    }
                    var shtml = '<tr class="data-product order_' + orderid + '">' +
                        '<td></td>' +
                        '<td style="cursor: pointer"><i class="plus ion-ios-more"></i></td>' +
                        '<td>' + row.CAMPAIGN_TITLE + '</td>' +
                        '<td><span class="img-campaign"><img src="' + imgurl + '"/></span></td>' +
                        '<td class="data-hl">' + row.VARIANT_NAME + '</td>';
                    if (myjs.custom['coldata'].includes('quantity')) {
                        shtml += '<td>' + row.N_QUANTITY + '</td>';
                    }
                    if (myjs.custom['coldata'].includes('amount')) {
                        shtml += '<td><span class="state"><i style="color: ' + myjs.genStateColor(row.S_STATE) + '" class="ion-record"></i>' + row.S_STATE + '</span></td>';
                    }
                    if (myjs.custom['coldata'].includes('order-date')) {
                        shtml += '<td>' + row.DD_CREATE + '</td>';
                    }
                    if (myjs.custom['coldata'].includes('update')) {
                        shtml += '<td>' + row.DD_UPDATE + '</td>';
                    }
                    shtml += '</tr>';
                    $('table#tb-form tbody tr:eq(' + index + ')').after(shtml);
                });
                $('table#tb-form tbody tr:eq(' + index + ')').attr('d', '1');
                $('.act-order-product').children().removeClass('ion-ios-minus-outline').addClass('ion-ios-plus-outline');
                $(td).children().removeClass('ion-ios-plus-outline').addClass('ion-ios-minus-outline');
                $('.act-order-product').unbind('click').click(function () {
                    myjs.getOrderProductData(this);
                });
                $('.act-order-product').unbind('click').click(function () {
                    myjs.getOrderProductData(this);
                });
                myjs.endLoad($('#dataload'));
            },
            error: function () {
                myjs.endLoad($('#dataload'));
                openModalError();
            }
        });
    } else {
        if ($(td).find('i.ion-ios-minus-outline').length !== 0) {
            $('table#tb-form tbody tr.data-product').hide();
            $('.act-order-product').children().removeClass('ion-ios-minus-outline').addClass('ion-ios-plus-outline');
        } else {
            $('table#tb-form tbody tr.data-product').hide();
            $('table#tb-form tbody tr.order_' + orderid).show();
            $('.act-order-product').children().removeClass('ion-ios-minus-outline').addClass('ion-ios-plus-outline');
            $(td).children().removeClass('ion-ios-plus-outline').addClass('ion-ios-minus-outline');
        }
    }
};

Fulfillment.prototype.genStateColor = function (state) {
    if (state === 'created') {
        return '#72659b'
    }
    if (state === 'processing') {
        return '#084e8a'
    }
    if (state === 'placed') {
        return '#1498ea'
    }
    if (state === 'approved') {
        return '#03be5b'
    }
    return '#d33131'
};

Fulfillment.prototype.genStateText = function (state) {
    if (state === 'created') {
        return 'Order pending'
    }
    if (state === 'processing') {
        return 'Processing'
    }
    if (state === 'placed') {
        return 'Order confirm'
    }
    if (state === 'Fail') {
        return 'Fail'
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

    $("#sel-user").select2({
        placeholder: 'Select an user',
        ajax: {
            url: myjs.backendurl + "?cmd=searchUserData&type=filter",
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
    }).on("select2:select", function (e) {
        myjs.custom['user'] = $(this).val();
        myjs.getData();
    });

    $('#search-text').unbind('keypress').keypress(function (e) {
        if(e.keyCode === 13){
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
        myjs.getData();
    });

    $('#btn-refresh').unbind('click').click(function () {
        myjs.getData();
    });
};

var obj_order = new Fulfillment();
(function ($, AdminLTE) {
    obj_order.custom['selected'] = [];
    obj_order.custom['user'] = '';
    obj_order.custom['start'] = 0;
    obj_order.custom['length'] = 10;
    obj_order.custom['coldata'] = ['quantity', 'amount', 'order-date', 'update'];
    obj_order.custom['order'] = 'CREATE-DATE';
    obj_order.custom['dir'] = 'desc';
    obj_order.init('order');
    obj_order.setuporder();
})(jQuery, $.AdminLTE);