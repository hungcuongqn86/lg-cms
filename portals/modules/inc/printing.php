<?php

include('../../../config.php');
include('../../../class.php');
include(ROOTPATH.'/login/login.php');

require_once(ROOTPATH . '/modules/inc/functions/db_general.php');

$get_cmd = isset ($_GET['cmd']) ? $_GET['cmd'] : null;
$post_cmd = isset ($_POST['cmd']) ? $_POST['cmd'] : null;

if($get_cmd == 'getProductPrintingData'){
    //get partner id
    $partnerid = '';
    //params
    $sql = "BEGIN PKG_USER_CMS.GET_TB_USER_BY_ID(:sid,:sdata); END;";
    $id = $_SESSION["user"]['id'];

    //data
    $result = get_data_by_id($conn_user, $sql, $id);
    if($result && $result[0]) $partnerid = $result[0]['S_PARTNER_ID'];
    
    //params
    $sql = "BEGIN PKG_PRODUCT_PRINTING_CMS.GET_PRODUCT_PRINTING(:spartnerid,:startdate,:enddate,:sstate,:sstart,:slength,:ssearch,:sordercol,:sorderdir,:stotal,:stotalfilter,:scursor); END;";

    $order_col = "S_PRODUCT_NAME";
    if($_GET['order'][0]['column'] == 1) $order_col = "S_STATE";
    if($_GET['order'][0]['column'] == 2) $order_col = "S_PRODUCT_NAME";
    if($_GET['order'][0]['column'] == 5) $order_col = "N_QUANTITY";
    if($_GET['order'][0]['column'] == 6) $order_col = "D_CREATE";

    $params = array(':spartnerid'=> $partnerid,
                    ':sstate'    => $_GET['state'],
                    ':startdate' => $_GET['startdate'],
                    ':enddate'   => $_GET['enddate'],
                    ':sstart'    => $_GET['start'],
                    ':slength'   => $_GET['length'],
                    ':ssearch'   => "%".$_GET['search']['value']."%",
                    ':sordercol' => $order_col,
                    ':sorderdir' => $_GET['order'][0]['dir']
                    );
    //data
    $result = get_table_data($conn_cms, $sql, $params);
                    
    echo json_encode($result);
}

if($get_cmd == 'getCountProductPrinting'){
    //get partner id
    $partnerid = '';
    //params
    $sql = "BEGIN PKG_USER_CMS.GET_TB_USER_BY_ID(:sid,:sdata); END;";
    $id = $_SESSION["user"]['id'];

    //data
    $result = get_data_by_id($conn_user, $sql, $id);
    if($result && $result[0]) $partnerid = $result[0]['S_PARTNER_ID'];

    $sql = "BEGIN PKG_PRODUCT_PRINTING_CMS.COUNT_PROD_PRINTING_BY_STATE(:partnerid,:sstart,:send,:sdata); END;";
    $params = array(':sstart'    => $_GET['start'],
                    ':send'      => $_GET['end'],
                    ':partnerid' => $partnerid);
    //data
    $result = get_data($conn_cms, $sql, $params);
    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;
}

if($get_cmd == 'getProductPrintingInfo'){
    //params
    $sql = "BEGIN PKG_PRODUCT_PRINTING_CMS.GET_TB_PRODUCT_PRINTING_BY_ID(:sid,:sdata); END;";

    //data
    $result = get_data_by_id($conn_cms, $sql, $_GET['id']);
    $result = ($result[0])?$result[0]:null;
    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;
}

if($post_cmd == 'saveProductPrintingData'){
    //params
    $sql = "CALL PKG_PRODUCT_PRINTING_CMS.UPDATE_PRODUCT_PRINTING_STATE(:sid,:sstate)";
    $params = array(':sid'      => trim($_POST['id']),
                    ':sstate'   => $_POST['state']
                    );
    //data
    $result = update_data($conn_cms, $sql, $params);
                    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;

    $log = array('action'   => 'update',
                 'uri'      => 'printer',
                 'desc'     => $post_cmd.' id:'.$result);
}

if($post_cmd == 'acceptProductPrintData'){
    $arr_order = array();
    if($_POST['prod_print_arr'] && count($_POST['prod_print_arr'])){
        foreach($_POST['prod_print_arr'] as $prod_printid){
            //update product print status
            $sql = "CALL PKG_PRODUCT_PRINTING_CMS.UPDATE_TB_PRODUCT_PRINTING(:sid,:sstate,:sinfo)";
            $params = array(':sid'      => $prod_printid,
                            ':sstate'   => 'printing',
                            ':sinfo'    => $_POST['info']
                            );
            $result = update_data($conn_cms, $sql, $params);

            //get order
            $sql = "BEGIN PKG_PRODUCT_PRINTING_CMS.GET_TB_PRODUCT_PRINTING_BY_ID(:sid,:sdata); END;";

            //data
            $pro_print_data = get_data_by_id($conn_cms, $sql, $prod_printid);
            if(!in_array($pro_print_data[0]['S_ORDER_ID'], $arr_order) && $pro_print_data[0]['N_SENT_EMAIL'] == 0)
                $arr_order[] = $pro_print_data[0]['S_ORDER_ID'];
        }
    }

    //Send email to user
    if($arr_order){
        require_once(ROOTPATH . '/modules/inc/functions/db_email.php');

        //get email subject
        $sql = "BEGIN PKG_PRODUCT_PRINTING_CMS.GET_TB_EMAIL_TEMPLATE(:stype,:sdata); END;";
        $params = array(':stype' => 'order_printing');
        $email_temp_data = get_data($conn_cms, $sql, $params);
        $subject = $email_temp_data[0]['S_SUBJECT'];
        
        foreach($arr_order as $orderid){
            //get product printing data
            $sql = "BEGIN PKG_PRODUCT_PRINTING_CMS.GET_PRODUCT_PRINTING_EMAIL(:sorderid,:sdata); END;";
            $params = array(':sorderid' => $orderid);
            $item_data = get_data($conn_cms, $sql, $params);

            if($item_data && count($item_data)){
                $email = '';
                $prod_data = array();
                $shipping = array();
                foreach($item_data as $item){
                    $email = $item['S_SHIPPING_EMAIL'];
                    $state = $item['S_STATE'];
                    if($state == 'created') $state = 'Waiting for printing';
                    if($state == 'printing') $state = 'Printing';
                    if($state == 'printed') $state = 'Printed';
                    if($state == 'reject') $state = 'Rejected';
                    if($state == 'deny') $state = 'Deny';
                    if($state == 'approved') $state = 'Approved';
                    $prod_data[] = (object)array('name'     => $item['S_PRODUCT_NAME'],
                                                 'state'    => $state,
                                                 'image'    => ((int)$item['N_BACK_VIEW'])?$item['S_PRODUCT_BACK_IMG_URL']:$item['S_PRODUCT_FRONT_IMG_URL']
                                                 );
                    $shipping = (object)array('line1'       => $item['S_SHIPPING_LINE1'],
                                              'line2'       => $item['S_SHIPPING_LINE2'],
                                              'city'        => $item['S_SHIPPING_CITY'],
                                              'state'       => $item['S_SHIPPING_STATE'],
                                              'zipcode'     => $item['S_SHIPPING_POSTAL_CODE'],
                                              'country'     => $item['S_SHIPPING_COUNTRY_CODE']
                                              );
                }

                $smarty->register_resource("db", array("db_get_template_printing",
                                                       "db_get_timestamp",
                                                       "db_get_secure",
                                                       "db_get_trusted"));
                                            
                $smarty->assign('prod_data', $prod_data);
                $smarty->assign('shipping', $shipping);
                $content =  $smarty->fetch('db:index.tpl');

                //Insert to email marketing table
                $sql = "CALL PKG_PRODUCT_PRINTING_CMS.INSERT_TB_EMAIL_MARKETING(:sid,:semail,:ssubject,:scontent)";
                $params = array(':semail'       => $email,
                                ':ssubject'     => $subject,
                                ':scontent'     => $content
                                );
                insert_data($conn_cms, $sql, $params);

                //update product printing data N_SEND = 1
                $sql = "BEGIN PKG_PRODUCT_PRINTING_CMS.UPDATE_PRODUCT_PRINTING_EMAIL(:sid); END;";
                $params = array(':sid'      => $orderid);
                update_data($conn_cms, $sql, $params);
            }
        }
    }
                    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;

    $log = array('action'   => 'update',
                 'uri'      => 'printer',
                 'desc'     => $post_cmd.' ids:'.json_encode($_POST['prod_print_arr']));
}

require_once(ROOTPATH . '/modules/inc/functions/db_log.php');
?>