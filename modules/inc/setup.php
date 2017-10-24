<?php

include('../../config.php');
include('../../class.php');
include(ROOTPATH.'/login/login.php');

require_once(ROOTPATH . '/modules/inc/functions/db_general.php');

$get_cmd = isset ($_GET['cmd']) ? $_GET['cmd'] : null;
$post_cmd = isset ($_POST['cmd']) ? $_POST['cmd'] : null;

if($get_cmd == 'getPreferenceDataById'){
    //params
    $sql = "BEGIN PKG_PREFERENCES_CMS.GET_TB_PREFERENCES_BY_ID(:sid,:sdata); END;";
    $id = '';
    if(isset($_GET['id']) && trim($_GET['id'])) $id = trim($_GET['id']);

    //data
    $result = get_data_by_id($conn, $sql, $id);
                    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;
}

if($get_cmd == 'getPreferenceData'){
    //params
    $sql = "BEGIN PKG_PREFERENCES_CMS.GET_TB_PREFERENCES(:sstate,:sstart,:slength,:ssearch,:sordercol,:sorderdir,:stotal,:stotalfilter,:scursor); END;";

    $oder_col = "S_SCOPE";
    if($_GET['order'][0]['column'] == 0) $oder_col = "S_SCOPE";
    if($_GET['order'][0]['column'] == 1) $oder_col = "S_KEY";
    if($_GET['order'][0]['column'] == 2) $oder_col = "S_VALUE";
    if($_GET['order'][0]['column'] == 3) $oder_col = "S_STATE";
    if($_GET['order'][0]['column'] == 4) $oder_col = "D_CREATE";
    if($_GET['order'][0]['column'] == 5) $oder_col = "D_UPDATE";

    $params = array(':sstate'    => $_GET['state'],
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

if($post_cmd == 'savePreferenceData'){
    //Check data
    $_POST['state'] = (trim($_POST['state']))?$_POST['state']:"approved";

    if(isset($_POST['id']) && trim($_POST['id'])){
        //params
        $sql = "CALL PKG_PREFERENCES_CMS.UPDATE_TB_PREFERENCES(:sid,:sscope,:skey,:svalue,:sstate)";
        $params = array(':sid'      => trim($_POST['id']),
                        ':sscope'   => $_POST['scope'],
                        ':skey'     => $_POST['key'],
                        ':svalue'   => $_POST['value'],
                        ':sstate'   => $_POST['state']
                        );
        //data
        $result = update_data($conn, $sql, $params);
    }
    else{
        //params
        $sql = "CALL PKG_PREFERENCES_CMS.INSERT_TB_PREFERENCES(:sid,:sscope,:skey,:svalue,:sstate)";
        $params = array(':sscope'   => $_POST['scope'],
                        ':skey'     => $_POST['key'],
                        ':svalue'   => $_POST['value'],
                        ':sstate'   => $_POST['state']
                        );
        //data
        $result = insert_data($conn, $sql, $params);
    }
                    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;

    $log = array('action'   => (isset($_POST['id']) && trim($_POST['id']))?'update':'insert',
                 'uri'      => 'preference',
                 'desc'     => $post_cmd.' id:'.$result);
}

if($post_cmd == 'removePreferenceData'){
    //params
    $sql = "CALL PKG_PREFERENCES_CMS.REMOVE_TB_PREFERENCES(:sid)";
    $id = '';
    if(isset($_POST['id']) && trim($_POST['id'])) $id = trim($_POST['id']);

    $result = remove_data($conn, $sql, $id);
    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;

    $log = array('action'   => 'delete',
                 'uri'      => 'domain',
                 'desc'     => $post_cmd.' id:'.$id);
}

if($get_cmd == 'getCategoryDataById'){
    //params
    $sql = "BEGIN PKG_CATEGORY_CMS.GET_TB_CATEGORY_BY_ID(:sid,:sdata); END;";
    $id = '';
    if(isset($_GET['id']) && trim($_GET['id'])) $id = trim($_GET['id']);

    //data
    $result = get_data_by_id($conn, $sql, $id);
    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;
}

if($get_cmd == 'getCategoryData'){
    //params
    $sql = "BEGIN PKG_CATEGORY_CMS.GET_TB_CATEGORY(:sstate,:sparentid,:sstart,:slength,:ssearch,:sordercol,:sorderdir,:stotal,:stotalfilter,:scursor); END;";

    $oder_col = "S_NAME";
    if($_GET['order'][0]['column'] == 0) $oder_col = "S_NAME";
    if($_GET['order'][0]['column'] == 1) $oder_col = "PARENT_NAME";
    if($_GET['order'][0]['column'] == 2) $oder_col = "S_DESC";
    if($_GET['order'][0]['column'] == 3) $oder_col = "N_VISIBLE";
    if($_GET['order'][0]['column'] == 4) $oder_col = "S_STATE";
    if($_GET['order'][0]['column'] == 5) $oder_col = "D_CREATE";
    if($_GET['order'][0]['column'] == 6) $oder_col = "D_UPDATE";

    $params = array(':sstate'    => $_GET['state'],
                    ':sparentid'  => $_GET['parent_id'],
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

if($post_cmd == 'saveCategoryData'){
    //Check data
    $_POST['state'] = (trim($_POST['state']))?$_POST['state']:"approved";

    if(isset($_POST['id']) && trim($_POST['id'])){
        //params
        $sql = "CALL PKG_CATEGORY_CMS.UPDATE_TB_CATEGORY(:sid,:sname,:sdesc,:svisible,:sstate,:sparentid)";
        $params = array(':sid'      => trim($_POST['id']),
                        ':sname'    => $_POST['name'],
                        ':sdesc'    => $_POST['desc'],
                        ':svisible' => $_POST['visible'],
                        ':sstate'   => $_POST['state'],
                        ':sparentid'=> $_POST['parentid']
                        );
        //data
        $result = update_data($conn, $sql, $params);
    }
    else{
        //params
        $sql = "CALL PKG_CATEGORY_CMS.INSERT_TB_CATEGORY(:sid,:sname,:sdesc,:svisible,:sstate,:sparentid,:surl,:sdomain)";
        $params = array(':sname'    => $_POST['name'],
                        ':sdesc'    => $_POST['desc'],
                        ':svisible' => $_POST['visible'],
                        ':sstate'   => $_POST['state'],
                        ':sparentid'=> $_POST['parentid'],
                        ':surl'     => $_POST['url'],
                        ':sdomain'  => $_POST['domain']
                        );
        //data
        $result = insert_data($conn, $sql, $params);
    }
                    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;

    $log = array('action'   => (isset($_POST['id']) && trim($_POST['id']))?'update':'insert',
                 'uri'      => 'category',
                 'desc'     => $post_cmd.' id:'.$result);
}

if($post_cmd == 'removeCategoryData'){
    //params
    $sql = "CALL PKG_CATEGORY_CMS.REMOVE_TB_CATEGORY(:sid)";
    $id = '';
    if(isset($_POST['id']) && trim($_POST['id'])) $id = trim($_POST['id']);

    $result = remove_data($conn, $sql, $id);
    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;

    $log = array('action'   => 'delete',
                 'uri'      => 'category',
                 'desc'     => $post_cmd.' id:'.$id);
}

if($get_cmd == 'getDomainDataById'){
    //params
    $sql = "BEGIN PKG_DOMAIN_CMS.GET_TB_DOMAIN_BY_ID(:sid,:sdata); END;";
    $id = '';
    if(isset($_GET['id']) && trim($_GET['id'])) $id = trim($_GET['id']);

    //data
    $result = get_data_by_id($conn, $sql, $id);
                    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;
}

if($get_cmd == 'getDomainData'){
    //params
    $sql = "BEGIN PKG_DOMAIN_CMS.GET_TB_DOMAIN(:sstate,:sstart,:slength,:ssearch,:sordercol,:sorderdir,:stotal,:stotalfilter,:scursor); END;";

    $oder_col = "S_NAME";
    if($_GET['order'][0]['column'] == 0) $oder_col = "S_NAME";
    if($_GET['order'][0]['column'] == 1) $oder_col = "S_DESC";
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
    $result = get_table_data($conn, $sql, $params);
                    
    echo json_encode($result);
}

if($post_cmd == 'saveDomainData'){
    //Check data
    $_POST['state'] = (trim($_POST['state']))?$_POST['state']:"approved";
    
    if(isset($_POST['id']) && trim($_POST['id'])){
        //params
        $sql = "CALL PKG_DOMAIN_CMS.UPDATE_TB_DOMAIN(:sid,:sname,:sdesc,:sstate)";
        $params = array(':sid'      => trim($_POST['id']),
                        ':sname'    => $_POST['name'],
                        ':sdesc'    => $_POST['desc'],
                        ':sstate'   => $_POST['state']
                        );
        //data
        $result = update_data($conn, $sql, $params);
    }
    else{
        //params
        $sql = "CALL PKG_DOMAIN_CMS.INSERT_TB_DOMAIN(:sid,:sname,:sdesc,:sstate)";
        $params = array(':sname'    => $_POST['name'],
                        ':sdesc'    => $_POST['desc'],
                        ':sstate'   => $_POST['state']
                        );
        //data
        $result = insert_data($conn, $sql, $params);
    }
                    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;

    $log = array('action'   => (isset($_POST['id']) && trim($_POST['id']))?'update':'insert',
                 'uri'      => 'domain',
                 'desc'     => $post_cmd.' id:'.$result);
}

if($post_cmd == 'removeDomainData'){
    //params
    $sql = "CALL PKG_DOMAIN_CMS.REMOVE_TB_DOMAIN(:sid)";
    $id = '';
    if(isset($_POST['id']) && trim($_POST['id'])) $id = trim($_POST['id']);

    $result = remove_data($conn, $sql, $id);
    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;

    $log = array('action'   => 'delete',
                 'uri'      => 'domain',
                 'desc'     => $post_cmd.' id:'.$id);
}

if($get_cmd == 'checkExistURL'){
    //params
    $sql = "BEGIN PKG_URL_CMS.CHECK_EXIST_URL(:surl,:scheck); END;";
    
    $params = array(':surl'    => $_GET['url']);

    //data
    $result = check_data($conn, $sql, $params);
    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;
}

if($get_cmd == 'getDomainCombo'){
    //params
    $sql = "BEGIN PKG_DOMAIN_CMS.GET_TB_DOMAIN_COMBO(:sdata); END;";

    //data
    $result = get_combo_data($conn, $sql, null);
    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;
}

if($get_cmd == 'getLogData'){
    //params
    $sql = "BEGIN PKG_LOGS_CMS.GET_TB_LOGS(:sstartdate,:senddate,:sstart,:slength,:ssearch,:sordercol,:sorderdir,:stotal,:stotalfilter,:scursor); END;";

    $oder_col = "D_CREATE";
    if($_GET['order'][0]['column'] == 0) $oder_col = "D_CREATE";
    if($_GET['order'][0]['column'] == 1) $oder_col = "USER_NAME";
    if($_GET['order'][0]['column'] == 2) $oder_col = "S_IP";
    if($_GET['order'][0]['column'] == 3) $oder_col = "S_ACTION";
    if($_GET['order'][0]['column'] == 4) $oder_col = "S_URI";
    if($_GET['order'][0]['column'] == 5) $oder_col = "S_DESC";

    $params = array(':sstartdate'=> $_GET['startdate'],
                    ':senddate'  => $_GET['enddate'],
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

if($get_cmd == 'getCountryDataById'){
    //params
    $sql = "BEGIN PKG_COUNTRY_CMS.GET_TB_COUNTRY_BY_ID(:sid,:sdata); END;";
    $id = '';
    if(isset($_GET['id']) && trim($_GET['id'])) $id = trim($_GET['id']);

    //data
    $result = get_data_by_id($conn_user, $sql, $id);
    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;
}

if($get_cmd == 'getCountryData'){
    //params
    $sql = "BEGIN PKG_COUNTRY_CMS.GET_TB_COUNTRY(:sstate,:sstart,:slength,:ssearch,:sordercol,:sorderdir,:stotal,:stotalfilter,:scursor); END;";

    $oder_col = "S_NAME";
    if($_GET['order'][0]['column'] == 0) $oder_col = "S_NAME";
    if($_GET['order'][0]['column'] == 2) $oder_col = "S_ISO_ALPHA_CODE";
    if($_GET['order'][0]['column'] == 3) $oder_col = "S_ISO_NUMBER_CODE";
    if($_GET['order'][0]['column'] == 4) $oder_col = "S_STATE";
    if($_GET['order'][0]['column'] == 5) $oder_col = "D_CREATE";
    if($_GET['order'][0]['column'] == 6) $oder_col = "D_UPDATE";

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

if($get_cmd == 'getCountryCombo'){
    //params
    $sql = "BEGIN PKG_COUNTRY_CMS.GET_TB_COUNTRY_COMBO(:sdata); END;";

    //data
    $result = get_combo_data($conn_user, $sql, null);
    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;
}

if($post_cmd == 'saveCountryData'){
    //Check data
    $_POST['state'] = (trim($_POST['state']))?$_POST['state']:"approved";
    if(isset($_POST['id']) && trim($_POST['id'])){
        //params
        $sql = "CALL PKG_COUNTRY_CMS.UPDATE_TB_COUNTRY(:sid,:sname,:sflag,:siso_alpha_code,:siso_number_code,:sstate)";
        $params = array(':sid'              => trim($_POST['id']),
                        ':sname'            => $_POST['name'],
                        ':sflag'            => $_POST['flag'],
                        ':siso_alpha_code'  => $_POST['iso_alpha_code'],
                        ':siso_number_code' => $_POST['iso_number_code'],
                        ':sstate'           => $_POST['state']
                        );
        //data
        $result = update_data($conn_user, $sql, $params);
    }
    else{
        //params
        $sql = "CALL PKG_COUNTRY_CMS.INSERT_TB_COUNTRY(:sid,:sname,:sflag,:siso_alpha_code,:siso_number_code,:sstate)";
        $params = array(':sname'            => $_POST['name'],
                        ':sflag'            => $_POST['flag'],
                        ':siso_alpha_code'  => $_POST['iso_alpha_code'],
                        ':siso_number_code' => $_POST['iso_number_code'],
                        ':sstate'           => $_POST['state']
                        );
        //data
        $result = insert_data($conn_user, $sql, $params);
    }
                    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;

    $log = array('action'   => (isset($_POST['id']) && trim($_POST['id']))?'update':'insert',
                 'uri'      => 'country',
                 'desc'     => $post_cmd.' id:'.$result);
}

if($post_cmd == 'removeCountryData'){
    //params
    $sql = "CALL PKG_COUNTRY_CMS.REMOVE_TB_COUNTRY(:sid)";
    $id = '';
    if(isset($_POST['id']) && trim($_POST['id'])) $id = trim($_POST['id']);

    $result = remove_data($conn_user, $sql, $id);
    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;

    $log = array('action'   => 'delete',
                 'uri'      => 'country',
                 'desc'     => $post_cmd.' id:'.$id);
}

if($get_cmd == 'getStateDataById'){
    //params
    $sql = "BEGIN PKG_STATE_CMS.GET_TB_STATE_BY_ID(:sid,:sdata); END;";
    $id = '';
    if(isset($_GET['id']) && trim($_GET['id'])) $id = trim($_GET['id']);

    //data
    $result = get_data_by_id($conn_user, $sql, $id);
    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;
}

if($get_cmd == 'getStateData'){
    //params
    $sql = "BEGIN PKG_STATE_CMS.GET_TB_STATE(:scountryid,:sstate,:sstart,:slength,:ssearch,:sordercol,:sorderdir,:stotal,:stotalfilter,:scursor); END;";

    $oder_col = "S_NAME";
    if($_GET['order'][0]['column'] == 0) $oder_col = "S_NAME";
    if($_GET['order'][0]['column'] == 1) $oder_col = "COUNTRY_NAME";
    if($_GET['order'][0]['column'] == 2) $oder_col = "S_ISO_ALPHA_CODE";
    if($_GET['order'][0]['column'] == 3) $oder_col = "S_STATE";
    if($_GET['order'][0]['column'] == 4) $oder_col = "D_CREATE";
    if($_GET['order'][0]['column'] == 5) $oder_col = "D_UPDATE";

    $params = array(':scountryid'=> $_GET['country'],
                    ':sstate'    => $_GET['state'],
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

if($get_cmd == 'getStateCombo'){
    //params
    $sql = "BEGIN PKG_STATE_CMS.GET_TB_STATE_COMBO(:scountryid,:sdata); END;";

    $params = array(':scountryid'=> $_GET['country']);

    //data
    $result = get_combo_data($conn_user, $sql, $params);
    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;
}

if($post_cmd == 'saveStateData'){
    //Check data
    $_POST['state'] = (trim($_POST['state']))?$_POST['state']:"approved";
    if(isset($_POST['id']) && trim($_POST['id'])){
        //params
        $sql = "CALL PKG_STATE_CMS.UPDATE_TB_STATE(:sid,:sname,:scountryid,:siso_alpha_code,:sstate)";
        $params = array(':sid'              => trim($_POST['id']),
                        ':sname'            => $_POST['name'],
                        ':scountryid'       => $_POST['country'],
                        ':siso_alpha_code'  => $_POST['iso_alpha_code'],
                        ':sstate'           => $_POST['state']
                        );
        //data
        $result = update_data($conn_user, $sql, $params);
    }
    else{
        //params
        $sql = "CALL PKG_STATE_CMS.INSERT_TB_STATE(:sid,:sname,:scountryid,:siso_alpha_code,:sstate)";
        $params = array(':sname'            => $_POST['name'],
                        ':scountryid'       => $_POST['country'],
                        ':siso_alpha_code'  => $_POST['iso_alpha_code'],
                        ':sstate'           => $_POST['state']
                        );
        //data
        $result = insert_data($conn_user, $sql, $params);
    }
                    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;

    $log = array('action'   => (isset($_POST['id']) && trim($_POST['id']))?'update':'insert',
                 'uri'      => 'state',
                 'desc'     => $post_cmd.' id:'.$result);
}

if($post_cmd == 'removeStateData'){
    //params
    $sql = "CALL PKG_STATE_CMS.REMOVE_TB_STATE(:sid)";
    $id = '';
    if(isset($_POST['id']) && trim($_POST['id'])) $id = trim($_POST['id']);

    $result = remove_data($conn_user, $sql, $id);
    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;

    $log = array('action'   => 'delete',
                 'uri'      => 'state',
                 'desc'     => $post_cmd.' id:'.$id);
}

if($get_cmd == 'getLanguageDataById'){
    //params
    $sql = "BEGIN PKG_LANGUAGE_CMS.GET_TB_LANGUAGE_BY_ID(:sid,:sdata); END;";
    $id = '';
    if(isset($_GET['id']) && trim($_GET['id'])) $id = trim($_GET['id']);

    //data
    $result = get_data_by_id($conn_user, $sql, $id);
    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;
}

if($get_cmd == 'getLanguageData'){
    //params
    $sql = "BEGIN PKG_LANGUAGE_CMS.GET_TB_LANGUAGE(:sstate,:sstart,:slength,:ssearch,:sordercol,:sorderdir,:stotal,:stotalfilter,:scursor); END;";

    $oder_col = "S_NAME";
    if($_GET['order'][0]['column'] == 0) $oder_col = "S_NAME";
    if($_GET['order'][0]['column'] == 1) $oder_col = "S_STATE";
    if($_GET['order'][0]['column'] == 2) $oder_col = "D_CREATE";
    if($_GET['order'][0]['column'] == 3) $oder_col = "D_UPDATE";

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

if($get_cmd == 'getLanguageCombo'){
    //params
    $sql = "BEGIN PKG_LANGUAGE_CMS.GET_TB_LANGUAGE_COMBO(:sdata); END;";

    //data
    $result = get_combo_data($conn_user, $sql, null);
    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;
}

if($post_cmd == 'saveLanguageData'){
    //Check data
    $_POST['state'] = (trim($_POST['state']))?$_POST['state']:"approved";
    if(isset($_POST['id']) && trim($_POST['id'])){
        //params
        $sql = "CALL PKG_LANGUAGE_CMS.UPDATE_TB_LANGUAGE(:sid,:sname,:sstate)";
        $params = array(':sid'              => trim($_POST['id']),
                        ':sname'            => $_POST['name'],
                        ':sstate'           => $_POST['state']
                        );
        //data
        $result = update_data($conn_user, $sql, $params);
    }
    else{
        //params
        $sql = "CALL PKG_LANGUAGE_CMS.INSERT_TB_LANGUAGE(:sid,:sname,:sstate)";
        $params = array(':sname'            => $_POST['name'],
                        ':sstate'           => $_POST['state']
                        );
        //data
        $result = insert_data($conn_user, $sql, $params);
    }
                    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;

    $log = array('action'   => (isset($_POST['id']) && trim($_POST['id']))?'update':'insert',
                 'uri'      => 'language',
                 'desc'     => $post_cmd.' id:'.$result);
}

if($post_cmd == 'removeLanguageData'){
    //params
    $sql = "CALL PKG_LANGUAGE_CMS.REMOVE_TB_LANGUAGE(:sid)";
    $id = '';
    if(isset($_POST['id']) && trim($_POST['id'])) $id = trim($_POST['id']);

    $result = remove_data($conn_user, $sql, $id);
    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;

    $log = array('action'   => 'delete',
                 'uri'      => 'language',
                 'desc'     => $post_cmd.' id:'.$id);
}

if($get_cmd == 'getTimezoneDataById'){
    //params
    $sql = "BEGIN PKG_TIMEZONE_CMS.GET_TB_TIMEZONE_BY_ID(:sid,:sdata); END;";
    $id = '';
    if(isset($_GET['id']) && trim($_GET['id'])) $id = trim($_GET['id']);

    //data
    $result = get_data_by_id($conn_user, $sql, $id);
    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;
}

if($get_cmd == 'getTimezoneData'){
    //params
    $sql = "BEGIN PKG_TIMEZONE_CMS.GET_TB_TIMEZONE(:sstate,:sstart,:slength,:ssearch,:sordercol,:sorderdir,:stotal,:stotalfilter,:scursor); END;";

    $oder_col = "S_NAME";
    if($_GET['order'][0]['column'] == 0) $oder_col = "S_NAME";
    if($_GET['order'][0]['column'] == 1) $oder_col = "S_UTC";
    if($_GET['order'][0]['column'] == 2) $oder_col = "S_CODE";
    if($_GET['order'][0]['column'] == 3) $oder_col = "S_STATE";
    if($_GET['order'][0]['column'] == 4) $oder_col = "D_CREATE";
    if($_GET['order'][0]['column'] == 5) $oder_col = "D_UPDATE";

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

if($get_cmd == 'getTimezoneCombo'){
    //params
    $sql = "BEGIN PKG_TIMEZONE_CMS.GET_TB_TIMEZONE_COMBO(:sdata); END;";

    //data
    $result = get_combo_data($conn_user, $sql, null);
    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;
}

if($post_cmd == 'saveTimezoneData'){
    //Check data
    $_POST['state'] = (trim($_POST['state']))?$_POST['state']:"approved";
    if(isset($_POST['id']) && trim($_POST['id'])){
        //params
        $sql = "CALL PKG_TIMEZONE_CMS.UPDATE_TB_TIMEZONE(:sid,:sname,:sutc,:scode,:sstate)";
        $params = array(':sid'      => trim($_POST['id']),
                        ':sname'    => $_POST['name'],
                        ':sutc'     => $_POST['utc'],
                        ':scode'     => $_POST['code'],
                        ':sstate'   => $_POST['state']
                        );
        //data
        $result = update_data($conn_user, $sql, $params);
    }
    else{
        //params
        $sql = "CALL PKG_TIMEZONE_CMS.INSERT_TB_TIMEZONE(:sid,:sname,:sutc,:scode,:sstate)";
        $params = array(':sname'    => $_POST['name'],
                        ':sutc'     => $_POST['utc'],
                        ':scode'     => $_POST['code'],
                        ':sstate'   => $_POST['state']
                        );
        //data
        $result = insert_data($conn_user, $sql, $params);
    }
                    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;

    $log = array('action'   => (isset($_POST['id']) && trim($_POST['id']))?'update':'insert',
                 'uri'      => 'timezone',
                 'desc'     => $post_cmd.' id:'.$result);
}

if($post_cmd == 'removeTimezoneData'){
    //params
    $sql = "CALL PKG_TIMEZONE_CMS.REMOVE_TB_TIMEZONE(:sid)";
    $id = '';
    if(isset($_POST['id']) && trim($_POST['id'])) $id = trim($_POST['id']);

    $result = remove_data($conn_user, $sql, $id);
    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;

    $log = array('action'   => 'delete',
                 'uri'      => 'timezone',
                 'desc'     => $post_cmd.' id:'.$id);
}

if($get_cmd == 'getUserDataById'){
    //params
    $sql = "BEGIN PKG_USER_CMS.GET_TB_USER_BY_ID(:sid,:sdata); END;";
    $id = '';
    if(isset($_GET['id']) && trim($_GET['id'])) $id = trim($_GET['id']);

    //data
    $result = get_data_by_id($conn_user, $sql, $id);
    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;
}

if($get_cmd == 'getUserData'){
    //params
    $sql = "BEGIN PKG_USER_CMS.GET_TB_USER(:sstartdate,:senddate,:sstate,:sstart,:slength,:ssearch,:sordercol,:sorderdir,:stotal,:stotalfilter,:scursor); END;";

    $oder_col = "S_NAME";
    if($_GET['order'][0]['column'] == 0) $oder_col = "S_NAME";
    if($_GET['order'][0]['column'] == 1) $oder_col = "S_EMAIL";
    if($_GET['order'][0]['column'] == 3) $oder_col = "S_STATE";
    if($_GET['order'][0]['column'] == 4) $oder_col = "D_CREATE";
    if($_GET['order'][0]['column'] == 5) $oder_col = "D_UPDATE";

    $params = array(':sstartdate'=> $_GET['startdate'],
                    ':senddate'  => $_GET['enddate'],
                    ':sstate'    => $_GET['state'],
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

if($post_cmd == 'saveUserData'){
    //Check data
    $_POST['state'] = (trim($_POST['state']))?$_POST['state']:"approved";
    if(isset($_POST['id']) && trim($_POST['id'])){
        //params
        $sql = "CALL PKG_USER_CMS.UPDATE_TB_USER(:sid,:sname,:semail,:spassword,:sreferer,:ssource,:sstate,:savatar,:smobile,:sline1,:sline2,:scity,:saddr_poscode,:saddr_state,:saddr_country,:slanguage,:stimezone,:spartnerid)";
        $params = array(':sid'          => trim($_POST['id']),
                        ':sname'        => $_POST['name'],
                        ':semail'       => $_POST['email'],
                        ':spassword'    => ($_POST['password'])?md5($_POST['password']):"",
                        ':sreferer'     => $_POST['referer'],
                        ':ssource'      => $_POST['source'],
                        ':sstate'       => $_POST['state'],
                        ':savatar'      => $_POST['avatar'],
                        ':smobile'      => $_POST['mobile'],
                        ':sline1'       => $_POST['line1'],
                        ':sline2'       => $_POST['line2'],
                        ':scity'        => $_POST['city'],
                        ':saddr_poscode'=> $_POST['poscode'],
                        ':saddr_state'  => $_POST['addr_state'],
                        ':saddr_country'=> $_POST['country'],
                        ':slanguage'    => $_POST['language'],
                        ':stimezone'    => $_POST['timezone'],
                        ':spartnerid'   => $_POST['partnerid']
                        );
        //data
        $result = update_data($conn_user, $sql, $params);
    }
    else{
        //params
        $sql = "CALL PKG_USER_CMS.INSERT_TB_USER(:sid,:sname,:semail,:spassword,:sreferer,:ssource,:sstate,:savatar,:smobile,:sline1,:sline2,:scity,:saddr_poscode,:saddr_state,:saddr_country,:slanguage,:stimezone,:spartnerid)";
        $params = array(':sname'        => $_POST['name'],
                        ':semail'       => $_POST['email'],
                        ':spassword'    => ($_POST['password'])?md5($_POST['password']):"",
                        ':sreferer'     => $_POST['referer'],
                        ':ssource'      => $_POST['source'],
                        ':sstate'       => $_POST['state'],
                        ':savatar'      => $_POST['avatar'],
                        ':smobile'      => $_POST['mobile'],
                        ':sline1'       => $_POST['line1'],
                        ':sline2'       => $_POST['line2'],
                        ':scity'        => $_POST['city'],
                        ':saddr_poscode'=> $_POST['poscode'],
                        ':saddr_state'  => $_POST['addr_state'],
                        ':saddr_country'=> $_POST['country'],
                        ':slanguage'    => $_POST['language'],
                        ':stimezone'    => $_POST['timezone'],
                        ':spartnerid'   => $_POST['partnerid']
                        );
        //data
        $result = insert_data($conn_user, $sql, $params);
    }
                    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;

    $log = array('action'   => (isset($_POST['id']) && trim($_POST['id']))?'update':'insert',
                 'uri'      => 'user',
                 'desc'     => $post_cmd.' id:'.$result);
}

if($post_cmd == 'removeUserData'){
    //params
    $sql = "CALL PKG_USER_CMS.REMOVE_TB_USER(:sid)";
    $id = '';
    if(isset($_POST['id']) && trim($_POST['id'])) $id = trim($_POST['id']);

    $result = remove_data($conn_user, $sql, $id);
    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;

    $log = array('action'   => 'delete',
                 'uri'      => 'user',
                 'desc'     => $post_cmd.' id:'.$id);
}

if($get_cmd == 'getPaymentData'){
    //params
    $sql = "BEGIN PKG_PAYMENT_CMS.GET_USER_PAYMENT(:userid,:sdata); END;";

    $params = array(':userid'    => $_GET['userid']);

    //data
    $result = get_data($conn_user, $sql, $params);
    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;
}

if($post_cmd == 'savePaymentData'){
    //Check data
    $_POST['default'] = (trim($_POST['default']))?$_POST['default']:"paypal";
    $_POST['state'] = (trim($_POST['state']))?$_POST['state']:"approved";
    $sql = "CALL PKG_PAYMENT_CMS.SAVE_USER_PAYMENT(:sid,:sdefault,:paypal_email,:paypal_firstname,:paypal_lastname,:payoneer_email,:wiretransfer_accountname,:wiretransfer_accountnumber,:wiretransfer_routingnumber,:wiretransfer_country,:sstate)";
    $params = array(':sid'                          => $_POST['userid'],
                    ':sdefault'                     => $_POST['default'],
                    ':paypal_email'                 => $_POST['paypal_email'],
                    ':paypal_firstname'             => $_POST['paypal_firstname'],
                    ':paypal_lastname'              => $_POST['paypal_lastname'],
                    ':payoneer_email'               => $_POST['payoneer_email'],
                    ':wiretransfer_accountname'     => $_POST['wiretransfer_accountname'],
                    ':wiretransfer_accountnumber'   => $_POST['wiretransfer_accountnumber'],
                    ':wiretransfer_routingnumber'   => $_POST['wiretransfer_routingnumber'],
                    ':wiretransfer_country'         => $_POST['wiretransfer_country'],
                    ':sstate'                       => $_POST['state']
                    );
    //data
    $result = update_data($conn_user, $sql, $params);
                    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;
}

if($get_cmd == 'getAuthorizationData'){
    //params
    $sql = "BEGIN PKG_AUTHORIZATION_CMS.GET_USER_AUTHORIZATION(:userid,:sdata); END;";

    $params = array(':userid'    => $_GET['userid']);

    //data
    $result = get_data($conn_user, $sql, $params);
    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;
}

if($post_cmd == 'saveAuthorizationData'){
    //Check data
    $_POST['state'] = (trim($_POST['state']))?$_POST['state']:"approved";
    $sql = "CALL PKG_AUTHORIZATION_CMS.SAVE_USER_AUTHORIZATION(:sid,:sstate,:sexpire)";
    $params = array(':sid'      => $_POST['userid'],
                    ':sstate'   => $_POST['state'],
                    ':sexpire'  => $_POST['expire']
                    );
    //data
    $result = update_data($conn_user, $sql, $params);
                    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;
}

if($get_cmd == 'getModuleDataById'){
    //params
    $sql = "BEGIN PKG_MODULE_CMS.GET_TB_MODULE_BY_ID(:sid,:sdata); END;";
    $id = '';
    if(isset($_GET['id']) && trim($_GET['id'])) $id = trim($_GET['id']);

    //data
    $result = get_data_by_id($conn_user, $sql, $id);
    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;
}

if($get_cmd == 'getModuleData'){
    //params
    $sql = "BEGIN PKG_MODULE_CMS.GET_TB_MODULE(:sstate,:sstart,:slength,:ssearch,:sordercol,:sorderdir,:stotal,:stotalfilter,:scursor); END;";

    $oder_col = "S_NAME";
    if($_GET['order'][0]['column'] == 0) $oder_col = "S_NAME";
    if($_GET['order'][0]['column'] == 1) $oder_col = "S_URL";
    if($_GET['order'][0]['column'] == 2) $oder_col = "S_NOTE";
    if($_GET['order'][0]['column'] == 3) $oder_col = "S_STATE";

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

if($get_cmd == 'getModuleCombo'){
    //params
    $sql = "BEGIN PKG_MODULE_CMS.GET_TB_MODULE_COMBO(:sdata); END;";

    //data
    $result = get_combo_data($conn_user, $sql, null);
    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;
}

if($post_cmd == 'saveModuleData'){
    //Check data
    $_POST['state'] = (trim($_POST['state']))?$_POST['state']:"approved";
    if(isset($_POST['id']) && trim($_POST['id'])){
        //params
        $sql = "CALL PKG_MODULE_CMS.UPDATE_TB_MODULE(:sid,:sname,:surl,:snote,:sstate)";
        $params = array(':sid'              => trim($_POST['id']),
                        ':sname'            => $_POST['name'],
                        ':surl'             => $_POST['url'],
                        ':snote'            => $_POST['note'],
                        ':sstate'           => $_POST['state']
                        );
        //data
        $result = update_data($conn_user, $sql, $params);
    }
    else{
        //params
        $sql = "CALL PKG_MODULE_CMS.INSERT_TB_MODULE(:sid,:sname,:surl,:snote,:sstate)";
        $params = array(':sname'            => $_POST['name'],
                        ':surl'             => $_POST['url'],
                        ':snote'            => $_POST['note'],
                        ':sstate'           => $_POST['state']
                        );
        //data
        $result = insert_data($conn_user, $sql, $params);
    }
                    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;

    $log = array('action'   => (isset($_POST['id']) && trim($_POST['id']))?'update':'insert',
                 'uri'      => 'module',
                 'desc'     => $post_cmd.' id:'.$result);
}

if($post_cmd == 'removeModuleData'){
    //params
    $sql = "CALL PKG_MODULE_CMS.REMOVE_TB_MODULE(:sid)";
    $id = '';
    if(isset($_POST['id']) && trim($_POST['id'])) $id = trim($_POST['id']);

    $result = remove_data($conn_user, $sql, $id);
    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;

    $log = array('action'   => 'remove',
                 'uri'      => 'module',
                 'desc'     => $post_cmd.' id:'.$result);
}

if($get_cmd == 'getGroupDataById'){
    //params
    $sql = "BEGIN PKG_GROUP_CMS.GET_TB_GROUP_BY_ID(:sid,:sdata); END;";
    $id = '';
    if(isset($_GET['id']) && trim($_GET['id'])) $id = trim($_GET['id']);

    //data
    $result = get_data_by_id($conn_user, $sql, $id);
    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;
}

if($get_cmd == 'getGroupData'){
    //params
    $sql = "BEGIN PKG_GROUP_CMS.GET_TB_GROUP(:sstate,:sstart,:slength,:ssearch,:sordercol,:sorderdir,:stotal,:stotalfilter,:scursor); END;";

    $oder_col = "S_NAME";
    if($_GET['order'][0]['column'] == 0) $oder_col = "S_NAME";
    if($_GET['order'][0]['column'] == 1) $oder_col = "S_NOTE";
    if($_GET['order'][0]['column'] == 2) $oder_col = "S_STATE";

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

if($get_cmd == 'getGroupCombo'){
    //params
    $sql = "BEGIN PKG_GROUP_CMS.GET_TB_GROUP_COMBO(:sdata); END;";

    //data
    $result = get_combo_data($conn_user, $sql, null);
    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;
}

if($post_cmd == 'saveGroupData'){
    //Check data
    $_POST['state'] = (trim($_POST['state']))?$_POST['state']:"approved";
    if(isset($_POST['id']) && trim($_POST['id'])){
        //params
        $sql = "CALL PKG_GROUP_CMS.UPDATE_TB_GROUP(:sid,:sname,:snote,:sstate)";
        $params = array(':sid'              => trim($_POST['id']),
                        ':sname'            => $_POST['name'],
                        ':snote'            => $_POST['note'],
                        ':sstate'           => $_POST['state']
                        );
        //data
        $result = update_data($conn_user, $sql, $params);
    }
    else{
        //params
        $sql = "CALL PKG_GROUP_CMS.INSERT_TB_GROUP(:sid,:sname,:snote,:sstate)";
        $params = array(':sname'            => $_POST['name'],
                        ':snote'            => $_POST['note'],
                        ':sstate'           => $_POST['state']
                        );
        //data
        $result = insert_data($conn_user, $sql, $params);
    }
                    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;

    $log = array('action'   => (isset($_POST['id']) && trim($_POST['id']))?'update':'insert',
                 'uri'      => 'user-group',
                 'desc'     => $post_cmd.' id:'.$result);
}

if($post_cmd == 'removeGroupData'){
    //params
    $sql = "CALL PKG_GROUP_CMS.REMOVE_TB_GROUP(:sid)";
    $id = '';
    if(isset($_POST['id']) && trim($_POST['id'])) $id = trim($_POST['id']);

    $result = remove_data($conn_user, $sql, $id);
    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;

    $log = array('action'   => 'remove',
                 'uri'      => 'user-group',
                 'desc'     => $post_cmd.' id:'.$result);
}

if($get_cmd == 'getGroupModuleData'){
    //params
    $sql = "BEGIN PKG_GROUP_CMS.GET_GROUP_ROLE(:sgroupid,:sstart,:slength,:ssearch,:sordercol,:sorderdir,:stotal,:stotalfilter,:scursor); END;";

    $oder_col = "S_NAME";

    $params = array(':sgroupid'  => $_GET['id'],
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

if($get_cmd == 'getGroupModuleAvailableData'){
    //params
    $sql = "BEGIN PKG_GROUP_CMS.GET_GROUP_ROLE_AVAILABLE(:sgroupid,:sstart,:slength,:ssearch,:sordercol,:sorderdir,:stotal,:stotalfilter,:scursor); END;";

    $oder_col = "S_NAME";

    $params = array(':sgroupid'  => $_GET['id'],
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

if($post_cmd == 'saveGroupModuleData'){
    
    //params
    if($_POST['type'] == 'add')
        $sql = "CALL PKG_GROUP_CMS.ADD_GROUP_ROLE(:sid,:smoduleid)";
    else
        $sql = "CALL PKG_GROUP_CMS.REMOVE_GROUP_ROLE(:sid,:smoduleid)";

    foreach($_POST['module_arr'] as $module_id){
         $params = array(':sid'         => trim($_POST['id']),
                         ':smoduleid'   => $module_id
                        );
        //data
        assign_data($conn_user, $sql, $params);
    }
                    
    $json_string = '{"result":'.json_encode(true).'}';
    echo $json_string;

    $log = array('action'   => 'update',
                 'uri'      => 'user-group',
                 'desc'     => $post_cmd.' id:'.$_POST['id']);
}

if($get_cmd == 'getGroupUserData'){
    //params
    $sql = "BEGIN PKG_GROUP_CMS.GET_GROUP_USER(:sgroupid,:sstart,:slength,:ssearch,:sordercol,:sorderdir,:stotal,:stotalfilter,:scursor); END;";

    $oder_col = "S_EMAIL";

    $params = array(':sgroupid'  => $_GET['id'],
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

if($get_cmd == 'getGroupUserAvailableData'){
    //params
    $sql = "BEGIN PKG_GROUP_CMS.GET_GROUP_USER_AVAILABLE(:sgroupid,:sstart,:slength,:ssearch,:sordercol,:sorderdir,:stotal,:stotalfilter,:scursor); END;";

    $oder_col = "S_EMAIL";

    $params = array(':sgroupid'  => $_GET['id'],
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

if($post_cmd == 'saveGroupUserData'){
    
    //params
    if($_POST['type'] == 'add')
        $sql = "CALL PKG_GROUP_CMS.ADD_GROUP_USER(:sid,:suserid)";
    else
        $sql = "CALL PKG_GROUP_CMS.REMOVE_GROUP_USER(:sid,:suserid)";

    foreach($_POST['user_arr'] as $user_id){
         $params = array(':sid'         => trim($_POST['id']),
                         ':suserid'   => $user_id
                        );
        //data
        assign_data($conn_user, $sql, $params);
    }
                    
    $json_string = '{"result":'.json_encode(true).'}';
    echo $json_string;

    $log = array('action'   => 'update',
                 'uri'      => 'user-group',
                 'desc'     => $post_cmd.' id:'.$_POST['id']);
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

require_once(ROOTPATH . '/modules/inc/functions/db_log.php');
?>