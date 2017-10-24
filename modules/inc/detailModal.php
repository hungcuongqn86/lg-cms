<?php

include('../../config.php');
include('../../class.php');
include(ROOTPATH . '/login/login.php');

require_once(ROOTPATH . '/modules/inc/functions/db_general.php');

$get_cmd = isset ($_GET['cmd']) ? $_GET['cmd'] : null;
$post_cmd = isset ($_POST['cmd']) ? $_POST['cmd'] : null;

if ($get_cmd == 'getProductPrintingInfo') {
    //params
    $sql = "BEGIN PKG_PRODUCT_PRINTING_CMS.GET_TB_PRODUCT_PRINTING_BY_ID(:sid,:sdata); END;";

    //data
    $result = get_data_by_id($conn_cms, $sql, $_GET['id']);
    $result = ($result[0]) ? $result[0] : null;

    $json_string = '{"result":' . json_encode($result) . '}';
    echo $json_string;
}

if ($get_cmd == 'getProductShippingInfo') {
    //params
    $sql = "BEGIN PKG_PRODUCT_SHIPPING_CMS.GET_TB_PRODUCT_SHIPPING_BY_ID(:sid,:sdata); END;";

    //data
    $result = get_data_by_id($conn_cms, $sql, $_GET['id']);
    $result = ($result[0]) ? $result[0] : null;

    $json_string = '{"result":' . json_encode($result) . '}';
    echo $json_string;
}

if ($get_cmd == 'getCampaignOrderInfo') {
    //params
    $sql = "BEGIN PKG_CAMPAIGN_ORDER_CMS.GET_TB_CAMPAIGN_ORDER_BY_ID(:sid,:sdata); END;";

    //data
    $result = get_data_by_id($conn, $sql, $_GET['id']);
    $result = ($result[0]) ? $result[0] : null;

    $json_string = '{"result":' . json_encode($result) . '}';
    echo $json_string;
}

require_once(ROOTPATH . '/modules/inc/functions/db_log.php');
?>