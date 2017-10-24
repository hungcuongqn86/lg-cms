<?php

include('../../config.php');
include('../../class.php');
include(ROOTPATH.'/login/login.php');

require_once(ROOTPATH . '/modules/inc/functions/db_general.php');

$get_cmd = isset ($_GET['cmd']) ? $_GET['cmd'] : null;
$post_cmd = isset ($_POST['cmd']) ? $_POST['cmd'] : null;

if($post_cmd == 'changePassword'){
    $error = "";
    $result = "";
    if(!strlen($_POST['curr_pw'])){
        $error = "Please enter current password.";
    }
    elseif(!strlen($_POST['new_pw'])){
        $error = "Please enter new password.";
    }
    elseif(!strlen($_POST['new_pw_2'])){
        $error = "Please enter new password (again).";
    }
    elseif($_POST['new_pw'] != $_POST['new_pw_2']){
        $error = "Password confirm is different from password.";
    }
    else{
        //params
        $sql = "BEGIN PKG_USER_CMS.CHECK_USER_LOGIN(:semail,:spassword,:sdata); END;";
    
        $params = array(':semail'     => $_SESSION["user"]["email"],
                        ':spassword'  => md5($_POST["curr_pw"])
                        );
        //data
        $result = get_data($conn_user, $sql, $params);
        
        if($result && $result[0] && $result[0]["S_ID"]){
            //params
            $sql = "BEGIN PKG_USER_CMS.UPDATE_USER_PW(:sid,:spassword); END;";
            
            $params = array(':sid'        => $_SESSION["user"]["id"],
                            ':spassword'  => md5($_POST["new_pw"])
                            );
            //data
            $result = update_data($conn_user, $sql, $params);
        }
        else{
            $error = "You have entered a wrong current password.";
        }
    }
                    
    $json_string = '{"result":'.json_encode($result).', "error":'.json_encode($error).'}';
    echo $json_string;
}

if($get_cmd == 'getAffiliateData'){
    //get asp user id
    $sql = "BEGIN PKG_USER_CMS.GET_TB_USER_BY_ID(:sid,:sdata); END;";
    $userdata = get_data_by_id($conn, $sql, $_GET['id']);
    $state = $userdata[0]['S_STATE'];
    $asp_user_id = $userdata[0]['S_ASP_REF'];

    //get asp user data
    $sql = "BEGIN PKG_USER_CMS.GET_TB_USER_BY_ID(:sid,:sdata); END;";
    $result = get_data_by_id($conn_user, $sql, $asp_user_id);
    $result = ($result[0])?$result[0]:null;
    //get payment data
    $sql = "BEGIN PKG_PAYMENT_CMS.GET_USER_PAYMENT(:userid,:sdata); END;";
    $params = array(':userid'    => $asp_user_id);
    $result_payment = get_data($conn_user, $sql, $params);
    $result_payment = (isset($result_payment[0]))?$result_payment[0]:null;
    
    $json_string = '{"result":'.json_encode($result).',"result_payment":'.json_encode($result_payment).',"state":'.json_encode($state).'}';
    echo $json_string;
}
if($get_cmd == 'getAffiliateCampaign'){
    $sql = "BEGIN PKG_CAMPAIGN_CMS.GET_USER_CAMPAIGN(:sstart,:send,:sid,:sdata); END;";
    $params = array(':sstart'    => $_GET['start'],
                    ':send'      => $_GET['end'],
                    ':sid'       => $_GET['id']);
    //data
    $result = get_data($conn, $sql, $params);
    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;
}

if($post_cmd == 'updateAffiliateStatus'){
    //Check data
    $_POST['state'] = (trim($_POST['state']))?$_POST['state']:"approved";

    if(isset($_POST['id']) && trim($_POST['id'])){
        //params
        $sql = "CALL PKG_USER_CMS.UPDATE_USER_STATE(:sid,:sstate)";
        $params = array(':sid'      => $_POST['id'],
                        ':sstate'   => $_POST['state']
                        );
        //data
        $result = update_data($conn, $sql, $params);
    }
                    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;

    $log = array('action'   => 'update',
                 'uri'      => 'reports-affiliates',
                 'desc'     => $post_cmd.' id:'.$result);
}

if($get_cmd == 'getAffiliateOrder'){
    //params
    $sql = "BEGIN PKG_CAMPAIGN_CMS.GET_USER_ORDER(:sstart,:send,:sid,:sdata); END;";
    
    $params = array(':sstart'    => $_GET['start'],
                    ':send'      => $_GET['end'],
                    ':sid'       => $_GET['id'],
                    );

    //data
    $result = get_data($conn, $sql, $params);
                    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;
}

if($get_cmd == 'getCampaignInfo'){
    $sql = "BEGIN PKG_CAMPAIGN_CMS.GET_TB_CAMPAIGN_BY_ID(:sid,:sdata); END;";

    //data
    $result = get_data_by_id($conn, $sql, $_GET['id']);
    $result = ($result[0])?$result[0]:null;
    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;
}

if($get_cmd == 'getCustomerData'){
    //params
    $sql = "BEGIN PKG_CAMPAIGN_CMS.GET_CUSTOMER(:scampaign,:sstartdate,:senddate,:sstart,:slength,:ssearch,:sordercol,:sorderdir,:stotal,:stotalfilter,:scursor); END;";

    $oder_col = "TOTAL_ORDER";
    if($_GET['order'][0]['column'] == 4) $oder_col = "TOTAL_ORDER";
    if($_GET['order'][0]['column'] == 5) $oder_col = "REVENUE";

    $params = array(':scampaign' => $_GET['campid'],
                    ':sstartdate'=> $_GET['startdate'],
                    ':senddate'  => $_GET['enddate'],
                    ':sstart'    => $_GET['start'],
                    ':slength'   => $_GET['length'],
                    ':ssearch'   => "%".$_GET['search']['value']."%",
                    ':sordercol' => $oder_col,
                    ':sorderdir' => $_GET['order'][0]['dir']
                    );
    //data
    $result = get_table_data($conn, $sql, $params);
                    
    echo json_encode($result);
}

if($get_cmd == 'getCampaignProduct'){
    //get product data
    $sql = "BEGIN PKG_PRODUCT_CMS.GET_CAMPAIGN_PRODUCT(:sid,:sdata); END;";
    $params = array(':sid'       => $_GET['id']);
    $result = get_data($conn, $sql, $params);
    //get variant data
    $sql = "BEGIN PKG_PRODUCT_CMS.GET_PRODUCT_VARIANT(:sid,:sdata); END;";
    foreach($result as $key=>$product_item){
        $params = array(':sid'       => $product_item['S_ID']);
        $variant = get_data($conn, $sql, $params);
        $result[$key]['VARIANT'] = $variant;
    }
                    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;
}

require_once(ROOTPATH . '/modules/inc/functions/db_log.php');
?>