<?php

include('../../config.php');
include('../../class.php');
include(ROOTPATH . '/login/login.php');

require_once(ROOTPATH . '/modules/inc/functions/db_general.php');

$get_cmd = isset ($_GET['cmd']) ? $_GET['cmd'] : null;
$post_cmd = isset ($_POST['cmd']) ? $_POST['cmd'] : null;

if ($get_cmd == 'getFulfillmentData') {
    //params
    $sql = "BEGIN PKG_ORDER_CMS.GET_REPORT_ORDER(:sstartdate,:senddate,:sdata); END;";
    $params = array(':sstartdate' => $_GET['startdate'] . ' 00:00:00',
        ':senddate' => $_GET['enddate'] . ' 23:59:59'
    );

    //data
    $result = get_data($conn, $sql, $params);
    $awaiting = 0;
    $fulfilled = 0;
    $fulfilledrevenue = 0;
    $fail = 0;
    foreach ($result as $data) {
        if ($data['S_STATE'] === 'created') {
            $awaiting++;
        }
        if ($data['S_STATE'] === 'placed') {
            $fulfilled++;
            $fulfilledrevenue = $fulfilledrevenue + $data['S_AMOUNT'];
        }
        if ($data['S_STATE'] === 'fail') {
            $fail++;
        }
    }

    echo json_encode([$awaiting, $fulfilled, $fulfilledrevenue, $fail]);
}

if ($get_cmd == 'getChartOrderData') {
    //params
    $sql = "BEGIN PKG_ORDER_CMS.GET_TB_ORDER_CHART(:sstart,:send,:sstate,:sdata); END;";

    $params = array(':sstart' => $_GET['start'],
        ':send' => $_GET['end'],
        ':sstate' => $_GET['state']
    );

    //data
    $result = get_data($conn, $sql, $params);

    $json_string = '{"result":' . json_encode($result) . '}';
    echo $json_string;
}

if ($get_cmd == 'getChartPrintingData') {
    //params
    $sql = "BEGIN PKG_PRODUCT_PRINTING_CMS.GET_ALL_PRINTING_HISTORY(:p_startdate,:p_enddate,:sdata); END;";
    // 'DD/MM/YYYY HH24:MI:SS'
    $params = array(':p_startdate' => $_GET['start'] . ' 00:00:00',
        ':p_enddate' => $_GET['end'] . ' 23:59:59'
    );
    //data
    $record = get_data($conn_cms, $sql, $params);
    $res = [];
    if ($record) {
        $date = $record[0]['D_CREATE'];
        $created = 0;
        $printed = 0;
        $printing = 0;
        $approved = 0;
        $reject = 0;
        foreach ($record as $row) {
            if ($row['D_CREATE'] !== $date) {
                $res[$date] = [$created, $printed, $printing, $approved, $reject];
                $date = $row['D_CREATE'];
                $created = 0;
                $printed = 0;
                $printing = 0;
                $approved = 0;
                $reject = 0;
            }
            if ($row['S_STATE'] === 'created') {
                $created++;
            }
            if ($row['S_STATE'] === 'printed') {
                $printed++;
            }
            if ($row['S_STATE'] === 'printing') {
                $printing++;
            }
            if ($row['S_STATE'] === 'approved') {
                $approved++;
            }
            if ($row['S_STATE'] === 'reject') {
                $reject++;
            }
        }
        $res[$date] = [$created, $printed, $printing, $approved, $reject];
    }
    echo json_encode($res);
}

if ($get_cmd == 'getChartShippingData') {
    //params
    $sql = "BEGIN PKG_PRODUCT_SHIPPING_CMS.GET_ALL_SHIPPING_HISTORY(:p_startdate,:p_enddate,:sdata); END;";
    // 'DD/MM/YYYY HH24:MI:SS'
    $params = array(':p_startdate' => $_GET['start'] . ' 00:00:00',
        ':p_enddate' => $_GET['end'] . ' 23:59:59'
    );
    //data
    $record = get_data($conn_cms, $sql, $params);
    $res = [];
    if ($record) {
        $date = $record[0]['D_CREATE'];
        $created = 0;
        $shipping = 0;
        $processing = 0;
        $delivered = 0;
        $reject = 0;
        foreach ($record as $row) {
            if ($row['D_CREATE'] !== $date) {
                $res[$date] = [$created, $shipping, $processing, $delivered, $reject];
                $date = $row['D_CREATE'];
                $created = 0;
                $shipping = 0;
                $processing = 0;
                $delivered = 0;
                $reject = 0;
            }
            if ($row['S_STATE'] === 'created') {
                $created++;
            }
            if ($row['S_STATE'] === 'shipping') {
                $shipping++;
            }
            if ($row['S_STATE'] === 'processing') {
                $processing++;
            }
            if ($row['S_STATE'] === 'delivered') {
                $delivered++;
            }
            if ($row['S_STATE'] === 'failure') {
                $reject++;
            }
        }
        $res[$date] = [$created, $shipping, $processing, $delivered, $reject];
    }
    echo json_encode($res);
}

if ($get_cmd == 'getOrderReportData') {
    //params
    $sql = "BEGIN PKG_ORDER_CMS.GET_REPORT_ORDER(:sstartdate,:senddate,:sdata); END;";
    $params = array(':sstartdate' => $_GET['startdate'] . ' 00:00:00',
        ':senddate' => $_GET['enddate'] . ' 23:59:59'
    );

    //data
    $result = get_data($conn, $sql, $params);
    $pending = 0;
    $processing = 0;
    $confirm = 0;
    $fail = 0;
    foreach ($result as $data) {
        if ($data['S_STATE'] === 'created') {
            $pending++;
        }
        if ($data['S_STATE'] === 'processing') {
            $processing++;
        }
        if ($data['S_STATE'] === 'placed') {
            $confirm++;
        }
        if ($data['S_STATE'] === 'fail') {
            $fail++;
        }
    }
    echo json_encode([$pending, $processing, $confirm, $fail]);
}

if ($get_cmd == 'getOrderProductData') {
    $sql = "BEGIN PKG_ORDER_CMS.GET_PRODUCTS_BY_ORDER(:sorderid,:sdata); END;";

    $params = array(':sorderid' => $_GET['orderid']);
    //data
    $result = get_data($conn, $sql, $params);
    echo json_encode($result);
}

if ($get_cmd == 'getOrderData') {
    $sql = "BEGIN PKG_ORDER_CMS.GET_TB_ORDER(:suserid,:sstartdate,:senddate,:sstate,:ssearch,:sstart,:slength,:sordercol,:sorderdir,:stotalfilter,:scursor); END;";

    $params = array(':suserid' => $_GET['userid'],
        ':sstartdate' => $_GET['startdate'] . ' 00:00:00',
        ':senddate' => $_GET['enddate'] . ' 23:59:59',
        ':sstate' => $_GET['state'],
        ':ssearch' => "%" . $_GET['ssearch'] . "%",
        ':sstart' => $_GET['start'],
        ':slength' => $_GET['length'],
        ':sordercol' => $_GET['sordercol'],
        ':sorderdir' => $_GET['sorderdir']
    );
    //data
    $result = get_data_list($conn, $sql, $params);

    echo json_encode($result);
}

if ($get_cmd == 'searchUserData') {
    //params
    $sql = "BEGIN PKG_USER_CMS.SEARCH_TB_USER(:ssearch,:pagenumber,:pagelimit,:stotal,:scursor); END;";

    $params = array(':ssearch' => (isset($_GET['q'])) ? "%" . $_GET['q'] . "%" : "",
        ':pagenumber' => (isset($_GET['page'])) ? ((int)$_GET['page'] - 1) : 0,
        ':pagelimit' => 10
    );
    $text = "S_EMAIL";
    $include = null;
    if (isset($_GET['type']) && $_GET['type'] == 'filter') $include = 'all';
    //data
    $result = search_data($conn, $sql, $params, $text, $include);

    echo json_encode($result);
}

if ($get_cmd == 'getPrintingReportData') {
    //params
    $sql = "BEGIN PKG_PRODUCT_PRINTING_CMS.GET_ALL_PRINTING_HISTORY(:p_startdate,:p_enddate,:sdata); END;";
    // 'DD/MM/YYYY HH24:MI:SS'
    $params = array(':p_startdate' => $_GET['startdate'] . ' 00:00:00',
        ':p_enddate' => $_GET['enddate'] . ' 23:59:59'
    );
    //data
    $record = get_data($conn_cms, $sql, $params);
    $created = 0;
    $printed = 0;
    $printing = 0;
    $approved = 0;
    if ($record) {
        foreach ($record as $row) {
            if ($row['S_STATE'] === 'created') {
                $created++;
            }
            if ($row['S_STATE'] === 'printed') {
                $printed++;
            }
            if ($row['S_STATE'] === 'printing') {
                $printing++;
            }
            if ($row['S_STATE'] === 'approved') {
                $approved++;
            }
        }
    }
    echo json_encode([$created, $printed, $printing, $approved]);
}

if ($get_cmd == 'getCampaignOrderData') {
    //params
    $sql = "BEGIN PKG_CAMPAIGN_ORDER_CMS.GET_TB_CAMPAIGN_ORDER_BY_DATE(:sstartdate,:senddate,:sstate,:ssearch,:sstart,:slength,:sordercol,:sorderdir,:sduedate,:stotalfilter,:scursor); END;";

    $params = array(':sstartdate' => $_GET['startdate'] . ' 00:00:00',
        ':senddate' => $_GET['enddate'] . ' 23:59:59',
        ':sstate' => $_GET['state'],
        ':ssearch' => "%" . $_GET['ssearch'] . "%",
        ':sstart' => $_GET['start'],
        ':slength' => $_GET['length'],
        ':sordercol' => $_GET['sordercol'],
        ':sorderdir' => $_GET['sorderdir'],
        ':sduedate' => 0
    );
    //data
    $result = get_data_list($conn, $sql, $params);

    echo json_encode($result);
}

if ($get_cmd == 'searchPartnerData') {
    //params
    $sql = "BEGIN PKG_PARTNER_CMS.SEARCH_TB_PARTNER(:ssearch,:pagenumber,:pagelimit,:stotal,:scursor); END;";

    $params = array(':ssearch' => (isset($_GET['q'])) ? "%" . $_GET['q'] . "%" : "",
        ':pagenumber' => (isset($_GET['page'])) ? ((int)$_GET['page'] - 1) : 0,
        ':pagelimit' => 10
    );
    $text = "S_NAME";
    $include = null;
    if (isset($_GET['type']) && $_GET['type'] == 'filter') $include = 'all';
    //data
    $result = search_data($conn_user, $sql, $params, $text, $include);

    echo json_encode($result);
}

if ($get_cmd == 'getSignPartnerData') {
    //params
    $sql = "BEGIN PKG_PARTNER_CMS.GET_TB_PARTNER_BY_ID(:sid,:sdata); END;";
    $result = get_data_by_id($conn_user, $sql, $_GET['id']);
    echo json_encode($result);
}

if ($post_cmd == 'printCampaignOrderData') {
    if ($_POST['campaign_order_arr'] && count($_POST['campaign_order_arr'])) {
        foreach ($_POST['campaign_order_arr'] as $camp_orderid) {
            //get campaign order data
            $sql = "BEGIN PKG_CAMPAIGN_ORDER_CMS.GET_TB_CAMPAIGN_ORDER_BY_ID(:sid,:sdata); END;";

            $campaign_order_data = get_data_by_id($conn, $sql, $camp_orderid);
            $data = $campaign_order_data[0];
            $createdate = $data['CREATE_DATE'];
            $maxday = $data['DUE_DATE'];
            $expiredate = date('Y/m/d H:i:s', strtotime($createdate . "+$maxday days"));
            //insert to product printing table
            $sql = "CALL PKG_PRODUCT_PRINTING_CMS.INSERT_TB_PRODUCT_PRINTING(:sid,:p_partnerid,:p_campaign_orderid,:p_order_id,:p_tracking_number,:p_product_id,:p_product_name,:p_front_img_url,:p_back_img_url,:p_base_id,:p_base_name," .
                ":p_size,:p_color,:p_quantity,:p_front_design_id,:p_front_image_id,:p_front_image_url,:p_front_image_width,:p_front_image_height,:p_front_printable_top,:p_front_printable_left,:p_front_printable_width,:p_front_printable_height," .
                ":p_back_desigp_id,:p_back_image_id,:p_back_image_url,:p_back_image_width,:p_back_image_height,:p_back_printable_top,:p_back_printable_left,:p_back_printable_width,:p_back_printable_height," .
                ":p_shipping_id,:p_shipping_name,:p_shipping_email,:p_shipping_phone,:p_shipping_line1,:p_shipping_line2,:p_shipping_city,:p_shipping_state,:p_shipping_postal_code,:p_shipping_country_code,:p_shipping_as_gift,:p_expire,:p_max_day)";

            $params = array(':p_partnerid' => $_POST['partnerid'],
                ':p_campaign_orderid' => $camp_orderid,
                ':p_order_id' => $data['S_ORDER_ID'],
                ':p_tracking_number' => $data['S_TRACKING_CODE'],
                ':p_product_id' => $data['S_PRODUCT_ID'],
                ':p_product_name' => $data['S_PRODUCT_NAME'],
                ':p_front_img_url' => $data['S_PRODUCT_FRONT_IMG_URL'],
                ':p_back_img_url' => $data['S_PRODUCT_BACK_IMG_URL'],
                ':p_base_id' => $data['S_BASE_ID'],
                ':p_base_name' => $data['S_BASE_NAME'],
                ':p_size' => $data['S_SIZE'],
                ':p_color' => $data['S_COLOR'],
                ':p_quantity' => $data['N_QUANTITY'],
                ':p_front_design_id' => $data['S_FRONT_DESIGN_ID'],
                ':p_front_image_id' => $data['S_FRONT_IMAGE_ID'],
                ':p_front_image_url' => $data['S_FRONT_IMAGE_URL'],
                ':p_front_image_width' => $data['S_FRONT_IMAGE_WIDTH'],
                ':p_front_image_height' => $data['S_FRONT_IMAGE_HEIGHT'],
                ':p_front_printable_top' => $data['S_FRONT_PRINTABLE_TOP'],
                ':p_front_printable_left' => $data['S_FRONT_PRINTABLE_LEFT'],
                ':p_front_printable_width' => $data['S_FRONT_PRINTABLE_WIDTH'],
                ':p_front_printable_height' => $data['S_FRONT_PRINTABLE_HEIGHT'],
                ':p_back_desigp_id' => $data['S_BACK_DESIGN_ID'],
                ':p_back_image_id' => $data['S_BACK_IMAGE_ID'],
                ':p_back_image_url' => $data['S_BACK_IMAGE_URL'],
                ':p_back_image_width' => $data['S_BACK_IMAGE_WIDTH'],
                ':p_back_image_height' => $data['S_BACK_IMAGE_HEIGHT'],
                ':p_back_printable_top' => $data['S_BACK_PRINTABLE_TOP'],
                ':p_back_printable_left' => $data['S_BACK_PRINTABLE_LEFT'],
                ':p_back_printable_width' => $data['S_BACK_PRINTABLE_WIDTH'],
                ':p_back_printable_height' => $data['S_BACK_PRINTABLE_HEIGHT'],
                ':p_shipping_id' => $data['S_SHIPPING_ID'],
                ':p_shipping_name' => $data['S_SHIPPING_NAME'],
                ':p_shipping_email' => $data['S_SHIPPING_EMAIL'],
                ':p_shipping_phone' => $data['S_SHIPPING_PHONE'],
                ':p_shipping_line1' => $data['S_SHIPPING_LINE1'],
                ':p_shipping_line2' => $data['S_SHIPPING_LINE2'],
                ':p_shipping_city' => $data['S_SHIPPING_CITY'],
                ':p_shipping_state' => $data['S_SHIPPING_STATE'],
                ':p_shipping_postal_code' => $data['S_SHIPPING_POSTAL_CODE'],
                ':p_shipping_country_code' => $data['S_SHIPPING_COUNTRY_CODE'],
                ':p_shipping_as_gift' => $data['N_SHIPPING_AS_GIFT'],
                ':p_expire' => $expiredate,
                ':p_max_day' => $maxday
            );
            //data
            $result = insert_data($conn_cms, $sql, $params);

            //update campaign order status
            $sql = "CALL PKG_CAMPAIGN_ORDER_CMS.UPDATE_TB_CAMPAIGN_ORDER(:sid,:sstate)";
            $params = array(':sid' => $camp_orderid,
                ':sstate' => 'wait_for_print'
            );
            update_data($conn, $sql, $params);
        }
    }

    $json_string = '{"result":' . json_encode($result) . '}';
    echo $json_string;

    $log = array('action' => 'update',
        'uri' => 'campaign-order',
        'desc' => $post_cmd . ' ids:' . json_encode($_POST['campaign_order_arr']));
}

if ($get_cmd == 'getProductShippingData') {
    //params
    $sql = "BEGIN PKG_PRODUCT_SHIPPING_CMS.GET_TB_PRODUCT_SHIPPING_BY_DATE(:sstartdate,:senddate,:sstate,:ssearch,:sstart,:slength,:sordercol,:sorderdir,:stotalfilter,:scursor); END;";

    $params = array(':sstartdate' => $_GET['startdate'] . ' 00:00:00',
        ':senddate' => $_GET['enddate'] . ' 23:59:59',
        ':sstate' => $_GET['state'],
        ':ssearch' => "%" . $_GET['ssearch'] . "%",
        ':sstart' => $_GET['start'],
        ':slength' => $_GET['length'],
        ':sordercol' => $_GET['sordercol'],
        ':sorderdir' => $_GET['sorderdir']
    );
    //data
    $result = get_data_list($conn_cms, $sql, $params);
    echo json_encode($result);
}

if ($get_cmd == 'getShippingReportData') {
    //params
    $sql = "BEGIN PKG_PRODUCT_SHIPPING_CMS.GET_ALL_SHIPPING_HISTORY(:p_startdate,:p_enddate,:sdata); END;";
    // 'DD/MM/YYYY HH24:MI:SS'
    $params = array(':p_startdate' => $_GET['startdate'] . ' 00:00:00',
        ':p_enddate' => $_GET['enddate'] . ' 23:59:59'
    );
    //data
    $record = get_data($conn_cms, $sql, $params);
    $created = 0;
    $shipping = 0;
    $processing = 0;
    $reject = 0;
    if ($record) {
        foreach ($record as $row) {
            if ($row['S_STATE'] === 'created') {
                $created++;
            }
            if ($row['S_STATE'] === 'shipping') {
                $shipping++;
            }
            if ($row['S_STATE'] === 'processing') {
                $processing++;
            }
            if ($row['S_STATE'] === 'failure') {
                $reject++;
            }
        }
    }
    echo json_encode([$created, $shipping, $processing, $reject]);
}

if ($get_cmd == 'getHistoryPaymentData') {
    //params
    $sql = "BEGIN PKG_PAYMENT_CMS.GET_TB_PAYMENT_REPORT(:sstartdate,:senddate,:sstate,:sdata); END;";
    $params = array(':sstartdate' => $_GET['startdate'],
        ':senddate' => $_GET['enddate'],
        ':sstate' => $_GET['state']
    );

    //data
    $result = get_data($conn, $sql, $params);

    $total = 0;
    foreach ($result as $data) {
        $total += $data["TOTAL_AMOUNT"];
    }

    $json_string = '{"result":' . json_encode($result) . ', "total_amount":' . json_encode($total) . '}';
    echo $json_string;
}

if ($get_cmd == 'getHistoryOrderCampaignData') {
    //params
    $sql = "BEGIN PKG_ORDER_PRODUCT_CMS.GET_TB_ORDER_CAMPAIGN_REPORT(:sstartdate,:senddate,:sstate,:sdata); END;";
    $params = array(':sstartdate' => $_GET['startdate'],
        ':senddate' => $_GET['enddate'],
        ':sstate' => $_GET['state']
    );

    //data
    $result = get_data($conn, $sql, $params);

    $total_quantity = 0;
    $total_amount = 0;
    foreach ($result as $data) {
        $total_quantity += $data["TOTAL_QUANTITY"];
        $total_amount += $data["TOTAL_AMOUNT"];
    }

    $json_string = '{"result":' . json_encode($result) . ', "total_quantity":' . json_encode($total_quantity) . ', "total_amount":' . json_encode($total_amount) . '}';
    echo $json_string;
}

if ($get_cmd == 'getHistoryOrderProductData') {
    //params
    $sql = "BEGIN PKG_ORDER_PRODUCT_CMS.GET_TB_ORDER_PRODUCT_REPORT(:sstartdate,:senddate,:sstate,:sdata); END;";
    $params = array(':sstartdate' => $_GET['startdate'],
        ':senddate' => $_GET['enddate'],
        ':sstate' => $_GET['state']
    );

    //data
    $result = get_data($conn, $sql, $params);

    $total_quantity = 0;
    $total_amount = 0;
    foreach ($result as $data) {
        $total_quantity += $data["TOTAL_QUANTITY"];
        $total_amount += $data["TOTAL_AMOUNT"];
    }

    $json_string = '{"result":' . json_encode($result) . ', "total_quantity":' . json_encode($total_quantity) . ', "total_amount":' . json_encode($total_amount) . '}';
    echo $json_string;
}

if ($get_cmd == 'getHistoryCampaignData') {
    //params
    $sql = "BEGIN PKG_CAMPAIGN_CMS.GET_TB_CAMPAIGN_REPORT(:sstartdate,:senddate,:sstate,:sdata); END;";
    $params = array(':sstartdate' => $_GET['startdate'],
        ':senddate' => $_GET['enddate'],
        ':sstate' => $_GET['state']
    );

    //data
    $result = get_data($conn, $sql, $params);

    $total = 0;
    foreach ($result as $data) {
        $total += $data["TOTAL_CAMPAIGN"];
    }

    $json_string = '{"result":' . json_encode($result) . ', "total_campaign":' . json_encode($total) . '}';
    echo $json_string;
}

if ($get_cmd == 'getHistoryProductData') {
    //params
    $sql = "BEGIN PKG_PRODUCT_CMS.GET_TB_PRODUCT_REPORT(:sstartdate,:senddate,:sstate,:sdata); END;";
    $params = array(':sstartdate' => $_GET['startdate'],
        ':senddate' => $_GET['enddate'],
        ':sstate' => $_GET['state']
    );

    //data
    $result = get_data($conn, $sql, $params);

    $total = 0;
    foreach ($result as $data) {
        $total += $data["TOTAL_PRODUCT"];
    }

    $json_string = '{"result":' . json_encode($result) . ', "total_product":' . json_encode($total) . '}';
    echo $json_string;
}

if ($get_cmd == 'getOrderProductDetailData') {
    //params
    $sql = "BEGIN PKG_ORDER_PRODUCT_CMS.GET_ORDER_PRODUCT_REPORT(:sdate,:sstate,:sstart,:slength,:ssearch,:sordercol,:sorderdir,:stotal,:stotalfilter,:scursor); END;";

    $order_col = "S_NAME";
    if ($_GET['order'][0]['column'] == 0) $order_col = "S_NAME";
    if ($_GET['order'][0]['column'] == 1) $order_col = "PRODUCT_QUANTITY";
    if ($_GET['order'][0]['column'] == 2) $order_col = "PRODUCT_AMOUNT";

    $params = array(':sdate' => $_GET['date'],
        ':sstate' => $_GET['state'],
        ':sstart' => $_GET['start'],
        ':slength' => $_GET['length'],
        ':ssearch' => "%" . $_GET['search']['value'] . "%",
        ':sordercol' => $order_col,
        ':sorderdir' => $_GET['order'][0]['dir']
    );
    //data
    $result = get_table_data($conn, $sql, $params);

    echo json_encode($result);
}

if ($get_cmd == 'getOrderCampaignDetailData') {
    //params
    $sql = "BEGIN PKG_ORDER_PRODUCT_CMS.GET_ORDER_CAMPAIGN_REPORT(:sdate,:sstate,:sstart,:slength,:ssearch,:sordercol,:sorderdir,:stotal,:stotalfilter,:scursor); END;";

    $order_col = "S_TITLE";
    if ($_GET['order'][0]['column'] == 0) $order_col = "S_TITLE";
    if ($_GET['order'][0]['column'] == 1) $order_col = "CAMPAIGN_QUANTITY";
    if ($_GET['order'][0]['column'] == 2) $order_col = "CAMPAIGN_AMOUNT";

    $params = array(':sdate' => $_GET['date'],
        ':sstate' => $_GET['state'],
        ':sstart' => $_GET['start'],
        ':slength' => $_GET['length'],
        ':ssearch' => "%" . $_GET['search']['value'] . "%",
        ':sordercol' => $order_col,
        ':sorderdir' => $_GET['order'][0]['dir']
    );
    //data
    $result = get_table_data($conn, $sql, $params);

}

if ($get_cmd == 'getProductPrintingData') {
    //params
    $sql = "BEGIN PKG_PRODUCT_PRINTING_CMS.GET_TB_PRODUCT_PRINTING_BY_DATE(:sstartdate,:senddate,:sstate,:ssearch,:sstart,:slength,:sordercol,:sorderdir,:stotalfilter,:scursor); END;";
    $params = array(':sstartdate' => $_GET['startdate']. ' 00:00:00',
        ':senddate' => $_GET['enddate']. ' 23:59:59',
        ':sstate' => $_GET['state'],
        ':ssearch' => "%" . $_GET['ssearch'] . "%",
        ':sstart' => $_GET['start'],
        ':slength' => $_GET['length'],
        ':sordercol' => $_GET['sordercol'],
        ':sorderdir' => $_GET['sorderdir']
    );
    //data
    $result = get_data_list($conn_cms, $sql, $params);
    echo json_encode($result);
}

if ($post_cmd == 'acceptProductPrintData_Management') {
    if ($_POST['prod_print_arr'] && count($_POST['prod_print_arr'])) {
        foreach ($_POST['prod_print_arr'] as $prod_printid) {
            //update product print status
            $sql = "CALL PKG_PRODUCT_PRINTING_CMS.UPDATE_TB_PRODUCT_PRINTING(:sid,:sstate,:sinfo)";
            $params = array(':sid' => $prod_printid,
                ':sstate' => $_POST['state'],
                ':sinfo' => $_POST['info']
            );
            $result = update_data($conn_cms, $sql, $params);

            //update campaign order status
            if ($_POST['state'] == 'approved') {
                //get campaign order id
                $campaign_orderid = '';
                $sql = "BEGIN PKG_PRODUCT_PRINTING_CMS.GET_TB_PRODUCT_PRINTING_BY_ID(:sid,:sdata); END;";
                //data
                $prod_print_data = get_data_by_id($conn_cms, $sql, $prod_printid);
                if ($prod_print_data && $prod_print_data[0]) $campaign_orderid = $prod_print_data[0]['S_PSP_REF'];

                //insert to product printing table
                $data = $prod_print_data[0];
                $sql = "CALL PKG_PRODUCT_SHIPPING_CMS.INSERT_TB_PRODUCT_SHIPPING(:sid,:p_partnerid,:p_campaign_orderid,:p_order_id,:p_tracking_number,:p_product_id,:p_product_name,:p_front_img_url,:p_back_img_url,:p_base_id,:p_base_name," .
                    ":p_size,:p_color,:p_quantity,:p_shipping_id,:p_shipping_name,:p_shipping_email,:p_shipping_phone,:p_shipping_line1,:p_shipping_line2,:p_shipping_city," .
                    ":p_shipping_state,:p_shipping_postal_code,:p_shipping_country_code,:p_shipping_as_gift)";

                $params = array(':p_partnerid' => $data['S_PARTNER_ID'],
                    ':p_campaign_orderid' => $data['S_PSP_REF'],
                    ':p_order_id' => $data['S_ORDER_ID'],
                    ':p_tracking_number' => $data['S_TRACKING_CODE'],
                    ':p_product_id' => $data['S_PRODUCT_ID'],
                    ':p_product_name' => $data['S_PRODUCT_NAME'],
                    ':p_front_img_url' => $data['S_PRODUCT_FRONT_IMG_URL'],
                    ':p_back_img_url' => $data['S_PRODUCT_BACK_IMG_URL'],
                    ':p_base_id' => $data['S_BASE_ID'],
                    ':p_base_name' => $data['S_BASE_NAME'],
                    ':p_size' => $data['S_SIZE'],
                    ':p_color' => $data['S_COLOR'],
                    ':p_quantity' => $data['N_QUANTITY'],
                    ':p_shipping_id' => $data['S_SHIPPING_ID'],
                    ':p_shipping_name' => $data['S_SHIPPING_NAME'],
                    ':p_shipping_email' => $data['S_SHIPPING_EMAIL'],
                    ':p_shipping_phone' => $data['S_SHIPPING_PHONE'],
                    ':p_shipping_line1' => $data['S_SHIPPING_LINE1'],
                    ':p_shipping_line2' => $data['S_SHIPPING_LINE2'],
                    ':p_shipping_city' => $data['S_SHIPPING_CITY'],
                    ':p_shipping_state' => $data['S_SHIPPING_STATE'],
                    ':p_shipping_postal_code' => $data['S_SHIPPING_POSTAL_CODE'],
                    ':p_shipping_country_code' => $data['S_SHIPPING_COUNTRY_CODE'],
                    ':p_shipping_as_gift' => $data['N_SHIPPING_AS_GIFT']
                );
                //data
                $result = insert_data($conn_cms, $sql, $params);

                //udpate status
                $sql = "CALL PKG_CAMPAIGN_ORDER_CMS.UPDATE_TB_CAMPAIGN_ORDER(:sid,:sstate)";
                $params = array(':sid' => $campaign_orderid,
                    ':sstate' => 'wait_for_shipping'
                );
                //data
                $result = update_data($conn, $sql, $params);
            }
        }
    }

    $json_string = '{"result":' . json_encode($result) . '}';
    echo $json_string;

    $log = array('action' => 'update',
        'uri' => 'print-management',
        'desc' => $post_cmd . ' ids:' . json_encode($_POST['prod_print_arr']));
}

if ($post_cmd == 'createShipment') {
    $arr_order = array();
    if ($_POST['prod_shipping_arr'] && count($_POST['prod_shipping_arr'])) {
        foreach ($_POST['prod_shipping_arr'] as $prod_shippingid) {
            //get shipping data
            $sql = "BEGIN PKG_PRODUCT_SHIPPING_CMS.GET_TB_PRODUCT_SHIPPING_BY_ID(:sid,:sdata); END;";
            //data
            $shipping_data = get_data_by_id($conn_cms, $sql, $prod_shippingid);

            $to_addr = array('name' => $shipping_data[0]['S_SHIPPING_NAME'],
                'line1' => $shipping_data[0]['S_SHIPPING_LINE1'],
                'line2' => $shipping_data[0]['S_SHIPPING_LINE2'],
                'city' => $shipping_data[0]['S_SHIPPING_CITY'],
                'state' => $shipping_data[0]['S_SHIPPING_STATE'],
                'postal_code' => $shipping_data[0]['S_SHIPPING_POSTAL_CODE'],
                'country' => $shipping_data[0]['S_SHIPPING_COUNTRY_CODE'],
                'phone' => $shipping_data[0]['S_SHIPPING_PHONE']
            );
            $to_addr = (object)$to_addr;
            //get from address
            $sql = "BEGIN PKG_PRODUCT_SHIPPING_CMS.GET_TB_OWNER(:sdata); END;";
            //data
            $own_data = get_data($conn_cms, $sql, null);

            $from_addr = array('line1' => $own_data[0]['S_ADD_LINE1'],
                'line2' => $own_data[0]['S_ADD_LINE2'],
                'city' => $own_data[0]['S_CITY'],
                'state' => $own_data[0]['S_ADD_STATE'],
                'postal_code' => $own_data[0]['S_POSTAL_CODE'],
                'country' => $own_data[0]['S_COUNTRY'],
                'phone' => $own_data[0]['S_PHONE'],
                'company' => $own_data[0]['S_COMPANY']
            );
            $from_addr = (object)$from_addr;
            $baseid = $shipping_data[0]['S_BASE_ID'];
            $size = $shipping_data[0]['S_SIZE'];

            // $size = 'S';
            // $to_addr = array('name'         => "George Costanza",
            //                  'line1'        => "1 E 161st St.",
            //                  'line2'        => "",
            //                  'city'         => "Bronx",
            //                  'state'        => "NY",
            //                  'postal_code'  => "10451",
            //                  'country'      => "US",
            //                  'phone'        => ""
            //                  );
            // $to_addr = (object)$to_addr;

            //get weight product
            $sql = "BEGIN PKG_PRODUCT_SHIPPING_CMS.GET_PRODUCT_INFO_VALUE(:sbaseid,:ssize,:scheck); END;";
            $params = array(':sbaseid' => $baseid, ':ssize' => $size);
            $weight_prod = check_data($conn_cms, $sql, $params);

            //get base group id
            $sql = "BEGIN PKG_PRODUCT_SHIPPING_CMS.GET_BASE_GROUP_ID_BY_BASE_ID(:sbaseid,:scheck); END;";
            $params = array(':sbaseid' => $baseid);
            $base_groupid = check_data($conn_cms, $sql, $params);

            //get parcel info name
            $sql = "BEGIN PKG_PRODUCT_SHIPPING_CMS.GET_PARCEL_INFO_NAME(:sbasegroupid,:scheck); END;";
            $params = array(':sbasegroupid' => $base_groupid);
            $parcel_name = check_data($conn_cms, $sql, $params);

            $parcel = array('weight' => $weight_prod,
                'predefined_package' => $parcel_name
            );

            $parcel = (object)$parcel;
            //API shipment
            //param
            $param = array('from_addr' => $from_addr, 'to_addr' => $to_addr, 'parcel' => $parcel);

            $ch = curl_init();

            curl_setopt($ch, CURLOPT_URL, "http://api.30usd.com/ssp/api/v1/shipments");
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                    'Content-Type: application/json',
                    'Content-Length: ' . strlen(json_encode($param)))
            );

            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($param));

            //receive server response
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

            $data_output = curl_exec($ch);

            if (curl_error($ch)) {
                echo 'error:' . curl_error($ch);
                return;
            }
            curl_close($ch);
            //echo $data_output;exit;
            $data_output = json_decode($data_output);
            //update product shipping
            $sql = "CALL PKG_PRODUCT_SHIPPING_CMS.UPDATE_SHIPPING_SHIPMENT(:sid,:sstate,:sinfo,:spartnerref,:shippingcode,:shippingurl,:labelurl)";
            $params = array(':sid' => $prod_shippingid,
                ':sstate' => $_POST['state'],
                ':sinfo' => ($_POST['info']) ? $_POST['info'] : $data_output->carrier,
                ':spartnerref' => isset($data_output->id) ? $data_output->id : '',
                ':shippingcode' => isset($data_output->tracking_code) ? $data_output->tracking_code : '',
                ':shippingurl' => isset($data_output->tracking_url) ? $data_output->tracking_url : '',
                ':labelurl' => isset($data_output->url) ? $data_output->url : ''
            );
            //data
            $result = update_data($conn_cms, $sql, $params);

            if (!in_array($shipping_data[0]['S_ORDER_ID'], $arr_order) && $shipping_data[0]['N_SENT_EMAIL'] == 0)
                $arr_order[] = $shipping_data[0]['S_ORDER_ID'];
        }
    }

    //Send email to user
    if ($arr_order) {
        require_once(ROOTPATH . '/modules/inc/functions/db_email.php');

        //get email subject
        $sql = "BEGIN PKG_PRODUCT_PRINTING_CMS.GET_TB_EMAIL_TEMPLATE(:stype,:sdata); END;";
        $params = array(':stype' => 'order_shipping');
        $email_temp_data = get_data($conn_cms, $sql, $params);
        $subject = $email_temp_data[0]['S_SUBJECT'];

        foreach ($arr_order as $orderid) {
            //get product shipping data
            $sql = "BEGIN PKG_PRODUCT_SHIPPING_CMS.GET_PRODUCT_SHIPPING_EMAIL(:sorderid,:sdata); END;";
            $params = array(':sorderid' => $orderid);
            $item_data = get_data($conn_cms, $sql, $params);
            //get payment info
            $sql = "BEGIN PKG_PRODUCT_SHIPPING_CMS.GET_PAYMENT_INFO_EMAIL(:sorderid,:sdata); END;";
            $params = array(':sorderid' => $orderid);
            $payment_data = get_data($conn_cms, $sql, $params);

            if ($item_data && count($item_data)) {
                $email = '';
                $prod_data = array();
                $shipping = array();
                foreach ($item_data as $item) {
                    $email = $item['S_SHIPPING_EMAIL'];
                    $state = $item['S_STATE'];
                    if ($state == 'created') $state = 'Package received';
                    if ($state == 'processing') $state = 'Shipping';
                    if ($state == 'shipping') $state = 'Shipping';
                    $prod_data[] = (object)array('name' => $item['S_PRODUCT_NAME'],
                        'state' => $state,
                        'image' => ((int)$item['N_BACK_VIEW']) ? $item['S_PRODUCT_BACK_IMG_URL'] : $item['S_PRODUCT_FRONT_IMG_URL']
                    );
                    $shipping = (object)array('line1' => $item['S_SHIPPING_LINE1'],
                        'line2' => $item['S_SHIPPING_LINE2'],
                        'city' => $item['S_SHIPPING_CITY'],
                        'state' => $item['S_SHIPPING_STATE'],
                        'zipcode' => $item['S_SHIPPING_POSTAL_CODE'],
                        'country' => $item['S_SHIPPING_COUNTRY_CODE'],
                        'tracking_code' => $item['S_TRACKING_CODE'],
                        'carrier' => $item['S_INFO'],
                        'shipping_code' => $item['S_SHIPPING_CODE'],
                        'name' => $item['S_SHIPPING_NAME'],
                        'email' => $item['S_SHIPPING_EMAIL'],
                        'phone' => $item['S_SHIPPING_PHONE'],
                        'payment_create' => date('l M d, Y', strtotime($payment_data[0]['DD_CREATE'])),
                        'payment_method' => $payment_data[0]['S_METHOD']
                    );
                }

                $smarty->register_resource("db", array("db_get_template_shipping",
                    "db_get_timestamp",
                    "db_get_secure",
                    "db_get_trusted"));

                $smarty->assign('prod_data', $prod_data);
                $smarty->assign('shipping', $shipping);
                $content = $smarty->fetch('db:index.tpl');

                //Insert to email marketing table
                $sql = "CALL PKG_PRODUCT_PRINTING_CMS.INSERT_TB_EMAIL_MARKETING(:sid,:semail,:ssubject,:scontent)";
                $params = array(':semail' => $email,
                    ':ssubject' => $subject,
                    ':scontent' => $content
                );
                insert_data($conn_cms, $sql, $params);

                //update product shipping data N_SEND = 1
                $sql = "BEGIN PKG_PRODUCT_SHIPPING_CMS.UPDATE_PRODUCT_SHIPPING_EMAIL(:sid); END;";
                $params = array(':sid' => $orderid);
                update_data($conn_cms, $sql, $params);
            }
        }
    }

    $json_string = '{"result":' . json_encode($result) . '}';
    echo $json_string;

    $log = array('action' => 'update',
        'uri' => 'ship-management',
        'desc' => $post_cmd . ' ids:' . json_encode($_POST['prod_shipping_arr']));
}
?>