<?php

include('../../config.php');
include('../../class.php');
include(ROOTPATH.'/login/login.php');

require_once(ROOTPATH . '/modules/inc/functions/db_general.php');

$get_cmd = isset ($_GET['cmd']) ? $_GET['cmd'] : null;
$post_cmd = isset ($_POST['cmd']) ? $_POST['cmd'] : null;

if($get_cmd == 'getPartnerDataById'){
    //params
    $sql = "BEGIN PKG_PARTNER_CMS.GET_TB_PARTNER_BY_ID(:sid,:sdata); END;";
    $id = '';
    if(isset($_GET['id']) && trim($_GET['id'])) $id = trim($_GET['id']);

    //data
    $result = get_data_by_id($conn_user, $sql, $id);
                    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;
}

if($get_cmd == 'getPartnerData'){
    //params
    $sql = "BEGIN PKG_PARTNER_CMS.GET_TB_PARTNER(:sstate,:sstart,:slength,:ssearch,:sordercol,:sorderdir,:stotal,:stotalfilter,:scursor); END;";

    $oder_col = "S_NAME";
    if($_GET['order'][0]['column'] == 0) $oder_col = "S_NAME";
    if($_GET['order'][0]['column'] == 1) $oder_col = "S_TYPE";
    if($_GET['order'][0]['column'] == 2) $oder_col = "S_STATE";
    if($_GET['order'][0]['column'] == 3) $oder_col = "D_CREATE";
    if($_GET['order'][0]['column'] == 4) $oder_col = "D_UPDATE";

    $params = array(':sstate'    => $_GET['state'],
                    ':sstart'    => $_GET['start'],
                    ':slength'   => $_GET['length'],
                    ':ssearch'   => "%".$_GET['search']['value']."%",
                    ':sordercol' => $oder_col,
                    ':sorderdir' => $_GET['order'][0]['dir']
                    );
    //data
    $result = get_table_data($conn_user, $sql, $params);
                    
    echo json_encode($result);
}



if($post_cmd == 'savePartnerData'){

    if(isset($_POST['id']) && trim($_POST['id'])){
        //params
        $sql = "CALL PKG_PARTNER_CMS.UPDATE_TB_PARTNER(:sid,:sname,:stype,:sinfo,:sstate)";
        $params = array(':sid'      => trim($_POST['id']),
                        ':sname'    => $_POST['name'],
                        ':stype'    => $_POST['type'],
                        ':sinfo'    => $_POST['info'],
                        ':sstate'   => $_POST['state']
                        );
        //data
        $result = update_data($conn_user, $sql, $params);
    }
    else{
        //params
        $sql = "CALL PKG_PARTNER_CMS.INSERT_TB_PARTNER(:sid,:sname,:stype,:sinfo,:sstate)";
        $params = array(':sname'    => $_POST['name'],
                        ':stype'    => $_POST['type'],
                        ':sinfo'    => $_POST['info'],
                        ':sstate'   => $_POST['state']
                        );
        //data
        $result = insert_data($conn_user, $sql, $params);
    }
                    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;

    $log = array('action'   => (isset($_POST['id']) && trim($_POST['id']))?'update':'insert',
                 'uri'      => 'partner',
                 'desc'     => $post_cmd.' id:'.$result);
}

if($post_cmd == 'removePartnerData'){
    
    //params
    $sql = "CALL PKG_PARTNER_CMS.REMOVE_TB_PARTNER(:sid)";
    $id = '';
    if(isset($_POST['id']) && trim($_POST['id'])) $id = trim($_POST['id']);

    $result = remove_data($conn_user, $sql, $id);

    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;

    $log = array('action'   => 'delete',
                 'uri'      => 'partner',
                 'desc'     => $post_cmd.' id:'.$id);
}

if($get_cmd == 'searchPartnerData'){
    //params
    $sql = "BEGIN PKG_PARTNER_CMS.SEARCH_TB_PARTNER(:ssearch,:pagenumber,:pagelimit,:stotal,:scursor); END;";

    $params = array(':ssearch'   => (isset($_GET['q']))?"%".$_GET['q']."%":"",
                    ':pagenumber'=> (isset($_GET['page']))?((int)$_GET['page'] -1):0,
                    ':pagelimit' => 10
                    );
    $text = "S_NAME";
    $include = null;
    if(isset($_GET['type']) && $_GET['type'] == 'filter') $include = 'all';
    //data
    $result = search_data($conn_user, $sql, $params, $text, $include);
                    
    echo json_encode($result);
}

if($get_cmd == 'getPartnerUserData'){
    //params
    $sql = "BEGIN PKG_PARTNER_CMS.GET_PARTNER_USER(:spartnerid,:sstart,:slength,:ssearch,:sordercol,:sorderdir,:stotal,:stotalfilter,:scursor); END;";

    $oder_col = "S_EMAIL";

    $params = array(':spartnerid'=> $_GET['partner_id'],
                    ':sstart'    => $_GET['start'],
                    ':slength'   => $_GET['length'],
                    ':ssearch'   => "%".$_GET['search']['value']."%",
                    ':sordercol' => $oder_col,
                    ':sorderdir' => $_GET['order'][0]['dir']
                    );
    //data
    $result = get_table_data($conn_user, $sql, $params);
                    
    echo json_encode($result);
}

if($get_cmd == 'getPartnerUserAvailableData'){
    //params
    $sql = "BEGIN PKG_PARTNER_CMS.GET_PARTNER_USER_AVAILABLE(:spartnerid,:sstart,:slength,:ssearch,:sordercol,:sorderdir,:stotal,:stotalfilter,:scursor); END;";

    $oder_col = "S_EMAIL";

    $params = array(':spartnerid'=> $_GET['partner_id'],
                    ':sstart'    => $_GET['start'],
                    ':slength'   => $_GET['length'],
                    ':ssearch'   => "%".$_GET['search']['value']."%",
                    ':sordercol' => $oder_col,
                    ':sorderdir' => $_GET['order'][0]['dir']
                    );
    //data
    $result = get_table_data($conn_user, $sql, $params);
                    
    echo json_encode($result);
}

if($post_cmd == 'savePartnerUserData'){
    
    //params
    if($_POST['type'] == 'add')
        $sql = "CALL PKG_PARTNER_CMS.ADD_PARTNER_USER(:sid,:suserid)";
    else
        $sql = "CALL PKG_PARTNER_CMS.REMOVE_PARTNER_USER(:sid,:suserid)";

    foreach($_POST['user_arr'] as $user_id){
         $params = array(':sid'      => trim($_POST['id']),
                         ':suserid'  => $user_id
                        );
        //data
        assign_data($conn_user, $sql, $params);
    }
                    
    $json_string = '{"result":'.json_encode(true).'}';
    echo $json_string;

    $log = array('action'   => 'update',
                 'uri'      => 'store',
                 'desc'     => $post_cmd.' id:'.$_POST['id']);
}

require_once(ROOTPATH . '/modules/inc/functions/db_log.php');
?>