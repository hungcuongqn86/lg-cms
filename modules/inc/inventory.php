<?php

include('../../config.php');
include('../../class.php');
include(ROOTPATH.'/login/login.php');

require_once(ROOTPATH . '/modules/inc/functions/db_general.php');

$get_cmd = isset ($_GET['cmd']) ? $_GET['cmd'] : null;
$post_cmd = isset ($_POST['cmd']) ? $_POST['cmd'] : null;

if($get_cmd == 'getBaseDataById'){
    //params
    $sql = "BEGIN PKG_BASE_CMS.GET_TB_BASE_BY_ID(:sid,:sdata); END;";
    $id = '';
    if(isset($_GET['id']) && trim($_GET['id'])) $id = trim($_GET['id']);

    //data
    $result = get_data_by_id($conn, $sql, $id);
                    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;
}

if($get_cmd == 'getBaseData'){
    //params
    $sql = "BEGIN PKG_BASE_CMS.GET_TB_BASE(:sstate,:sstart,:slength,:ssearch,:sordercol,:sorderdir,:stotal,:stotalfilter,:scursor); END;";

    $oder_col = "S_NAME";
    if($_GET['order'][0]['column'] == 0) $oder_col = "S_NAME";
    if($_GET['order'][0]['column'] == 1) $oder_col = "TYPE_NAME";
    if($_GET['order'][0]['column'] == 2) $oder_col = "S_DESC";
    if($_GET['order'][0]['column'] == 3) $oder_col = "S_PRICE";
    if($_GET['order'][0]['column'] == 6) $oder_col = "N_POSITION";
    if($_GET['order'][0]['column'] == 7) $oder_col = "S_STATE";
    if($_GET['order'][0]['column'] == 8) $oder_col = "D_CREATE";
    if($_GET['order'][0]['column'] == 9) $oder_col = "D_UPDATE";

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

if($post_cmd == 'saveBaseData'){
    //Check data
    $_POST['state'] = (trim($_POST['state']))?$_POST['state']:"approved";
    $_POST['price'] = (is_numeric($_POST['price']))?$_POST['price']:0;
    $_POST['position'] = (is_numeric($_POST['position']))?$_POST['position']:1;
    $_POST['full_fillment'] = (is_numeric($_POST['full_fillment']))?$_POST['full_fillment']:0;
    $_POST['front_img_width'] = (is_numeric($_POST['front_img_width']))?((strlen($_POST['front_img_width'])>8)?substr($_POST['front_img_width'],0,8):$_POST['front_img_width']):'';
    $_POST['front_img_height'] = (is_numeric($_POST['front_img_height']))?((strlen($_POST['front_img_height'])>8)?substr($_POST['front_img_height'],0,8):$_POST['front_img_height']):'';
    $_POST['back_img_width'] = (is_numeric($_POST['back_img_width']))?((strlen($_POST['back_img_width'])>8)?substr($_POST['back_img_width'],0,8):$_POST['back_img_width']):'';
    $_POST['back_img_height'] = (is_numeric($_POST['back_img_height']))?((strlen($_POST['back_img_height'])>8)?substr($_POST['back_img_height'],0,8):$_POST['back_img_height']):'';

    $_POST['printable_front_top'] = (is_numeric($_POST['printable_front_top']))?((strlen($_POST['printable_front_top'])>8)?substr($_POST['printable_front_top'],0,8):$_POST['printable_front_top']):'';
    $_POST['printable_front_left'] = (is_numeric($_POST['printable_front_left']))?((strlen($_POST['printable_front_left'])>8)?substr($_POST['printable_front_left'],0,8):$_POST['printable_front_left']):'';
    $_POST['printable_front_width'] = (is_numeric($_POST['printable_front_width']))?((strlen($_POST['printable_front_width'])>8)?substr($_POST['printable_front_width'],0,8):$_POST['printable_front_width']):'';
    $_POST['printable_front_height'] = (is_numeric($_POST['printable_front_height']))?((strlen($_POST['printable_front_height'])>8)?substr($_POST['printable_front_height'],0,8):$_POST['printable_front_height']):'';
    $_POST['printable_back_top'] = (is_numeric($_POST['printable_back_top']))?((strlen($_POST['printable_back_top'])>8)?substr($_POST['printable_back_top'],0,8):$_POST['printable_back_top']):'';
    $_POST['printable_back_left'] = (is_numeric($_POST['printable_back_left']))?((strlen($_POST['printable_back_left'])>8)?substr($_POST['printable_back_left'],0,8):$_POST['printable_back_left']):'';
    $_POST['printable_back_width'] = (is_numeric($_POST['printable_back_width']))?((strlen($_POST['printable_back_width'])>8)?substr($_POST['printable_back_width'],0,8):$_POST['printable_back_width']):'';
    $_POST['printable_back_height'] = (is_numeric($_POST['printable_back_height']))?((strlen($_POST['printable_back_height'])>8)?substr($_POST['printable_back_height'],0,8):$_POST['printable_back_height']):'';

    if(isset($_POST['id']) && trim($_POST['id'])){
        //params
        $sql = "CALL PKG_BASE_CMS.UPDATE_TB_BASE(:sid,:sname,:sdesc,:sposition,:sstate,:stype,:sprice,:scurrency,
               :icon_img_url,:front_img_url,:front_img_width,:front_img_height,:back_img_url,:back_img_width,:back_img_height,:full_fillment,
               :printable_front_top,:printable_front_left,:printable_front_width,:printable_front_height,:printable_back_top,:printable_back_left,:printable_back_width,:printable_back_height,:sinclude)";
        $params = array(':sid'                      => trim($_POST['id']),
                        ':sname'                    => $_POST['name'],
                        ':sdesc'                    => $_POST['desc'],
                        ':sposition'                => $_POST['position'],
                        ':sstate'                   => $_POST['state'],
                        ':stype'                    => $_POST['type'],
                        ':sprice'                   => $_POST['price'],
                        ':scurrency'                => $_POST['currency'],
                        ':icon_img_url'             => $_POST['icon_img_url'],
                        ':front_img_url'            => $_POST['front_img_url'],
                        ':front_img_width'          => $_POST['front_img_width'],
                        ':front_img_height'         => $_POST['front_img_height'],
                        ':back_img_url'             => $_POST['back_img_url'],
                        ':back_img_width'           => $_POST['back_img_width'],
                        ':back_img_height'          => $_POST['back_img_height'],
                        ':full_fillment'            => $_POST['full_fillment'],
                        ':printable_front_top'      => $_POST['printable_front_top'],
                        ':printable_front_left'     => $_POST['printable_front_left'],
                        ':printable_front_width'    => $_POST['printable_front_width'],
                        ':printable_front_height'   => $_POST['printable_front_height'],
                        ':printable_back_top'       => $_POST['printable_back_top'],
                        ':printable_back_left'      => $_POST['printable_back_left'],
                        ':printable_back_width'     => $_POST['printable_back_width'],
                        ':printable_back_height'    => $_POST['printable_back_height'],
                        ':sinclude'                 => $_POST['include']
                        );
        //data
        $result = update_data($conn, $sql, $params);
    }
    else{
        //params
        $sql = "CALL PKG_BASE_CMS.INSERT_TB_BASE(:sid,:sname,:sdesc,:sposition,:sstate,:stype,:sprice,:scurrency,
               :icon_img_url,:front_img_url,:front_img_width,:front_img_height,:back_img_url,:back_img_width,:back_img_height,:full_fillment,
               :printable_front_top,:printable_front_left,:printable_front_width,:printable_front_height,:printable_back_top,:printable_back_left,:printable_back_width,:printable_back_height,:sinclude)";
        $params = array(':sname'                    => $_POST['name'],
                        ':sdesc'                    => $_POST['desc'],
                        ':sposition'                => $_POST['position'],
                        ':sstate'                   => $_POST['state'],
                        ':stype'                    => $_POST['type'],
                        ':sprice'                   => $_POST['price'],
                        ':scurrency'                => $_POST['currency'],
                        ':icon_img_url'             => $_POST['icon_img_url'],
                        ':front_img_url'            => $_POST['front_img_url'],
                        ':front_img_width'          => $_POST['front_img_width'],
                        ':front_img_height'         => $_POST['front_img_height'],
                        ':back_img_url'             => $_POST['back_img_url'],
                        ':back_img_width'           => $_POST['back_img_width'],
                        ':back_img_height'          => $_POST['back_img_height'],
                        ':full_fillment'            => $_POST['full_fillment'],
                        ':printable_front_top'      => $_POST['printable_front_top'],
                        ':printable_front_left'     => $_POST['printable_front_left'],
                        ':printable_front_width'    => $_POST['printable_front_width'],
                        ':printable_front_height'   => $_POST['printable_front_height'],
                        ':printable_back_top'       => $_POST['printable_back_top'],
                        ':printable_back_left'      => $_POST['printable_back_left'],
                        ':printable_back_width'     => $_POST['printable_back_width'],
                        ':printable_back_height'    => $_POST['printable_back_height'],
                        ':sinclude'                 => $_POST['include']
                        );
        //data
        $result = insert_data($conn, $sql, $params);
    }
                    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;

    $log = array('action'   => (isset($_POST['id']) && trim($_POST['id']))?'update':'insert',
                 'uri'      => 'base',
                 'desc'     => $post_cmd.' id:'.$result);
}

if($post_cmd == 'removeBaseData'){
    //params
    $sql = "CALL PKG_BASE_CMS.REMOVE_TB_BASE(:sid)";
    $id = '';
    if(isset($_POST['id']) && trim($_POST['id'])) $id = trim($_POST['id']);

    $result = remove_data($conn, $sql, $id);
    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;

    $log = array('action'   => 'delete',
                 'uri'      => 'base',
                 'desc'     => $post_cmd.' id:'.$id);
}

if($get_cmd == 'getBaseTypeDataById'){
    //params
    $sql = "BEGIN PKG_BASE_TYPE_CMS.GET_TB_BASE_TYPE_BY_ID(:sid,:sdata); END;";
    $id = '';
    if(isset($_GET['id']) && trim($_GET['id'])) $id = trim($_GET['id']);

    //data
    $result = get_data_by_id($conn, $sql, $id);
                    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;
}

if($get_cmd == 'getBaseTypeCombo'){
    //params
    $sql = "BEGIN PKG_BASE_TYPE_CMS.GET_TB_BASE_TYPE_COMBO(:sdata); END;";

    //data
    $result = get_combo_data($conn, $sql, null);
    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;
}

if($get_cmd == 'getBaseTypeData'){
    //params
    $sql = "BEGIN PKG_BASE_TYPE_CMS.GET_TB_BASE_TYPE(:sstate,:sstart,:slength,:ssearch,:sordercol,:sorderdir,:stotal,:stotalfilter,:scursor); END;";

    $oder_col = "S_NAME";
    if($_GET['order'][0]['column'] == 0) $oder_col = "S_NAME";
    if($_GET['order'][0]['column'] == 1) $oder_col = "GROUP_NAME";
    if($_GET['order'][0]['column'] == 2) $oder_col = "S_DESC";
    if($_GET['order'][0]['column'] == 3) $oder_col = "N_POSITION";
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
    $result = get_table_data($conn, $sql, $params);
                    
    echo json_encode($result);
}



if($post_cmd == 'saveBaseTypeData'){
    //check data
    $_POST['state'] = (trim($_POST['state']))?$_POST['state']:"approved";
    $_POST['position'] = (is_numeric($_POST['position']))?$_POST['position']:1;

    if(isset($_POST['id']) && trim($_POST['id'])){
        //params
        $sql = "CALL PKG_BASE_TYPE_CMS.UPDATE_TB_BASE_TYPE(:sid,:sname,:sdesc,:sposition,:sstate,:sgroupid, :simage)";
        $params = array(':sid'      => trim($_POST['id']),
                        ':sname'    => $_POST['name'],
                        ':sdesc'    => $_POST['desc'],
                        ':sposition'=> $_POST['position'],
                        ':sstate'   => $_POST['state'],
                        ':sgroupid' => $_POST['groupid'],
                        ':simage'   => $_POST['image']
                        );
        //data
        $result = update_data($conn, $sql, $params);
    }
    else{
        //params
        $sql = "CALL PKG_BASE_TYPE_CMS.INSERT_TB_BASE_TYPE(:sid,:sname,:sdesc,:sposition,:sstate,:sgroupid, :simage)";
        $params = array(':sname'    => $_POST['name'],
                        ':sdesc'    => $_POST['desc'],
                        ':sposition'=> $_POST['position'],
                        ':sstate'   => $_POST['state'],
                        ':sgroupid' => $_POST['groupid'],
                        ':simage'   => $_POST['image']
                        );
        //data
        $result = insert_data($conn, $sql, $params);
    }
                    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;

    $log = array('action'   => (isset($_POST['id']) && trim($_POST['id']))?'update':'insert',
                 'uri'      => 'base-type',
                 'desc'     => $post_cmd.' id:'.$result);
}

if($post_cmd == 'removeBaseTypeData'){
    
    //params
    $sql = "CALL PKG_BASE_TYPE_CMS.REMOVE_TB_BASE_TYPE(:sid)";
    $id = '';
    if(isset($_POST['id']) && trim($_POST['id'])) $id = trim($_POST['id']);

    $result = remove_data($conn, $sql, $id);

    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;

    $log = array('action'   => 'delete',
                 'uri'      => 'base-type',
                 'desc'     => $post_cmd.' id:'.$id);
}

if($get_cmd == 'getBaseSizeDataById'){
    //params
    $sql = "BEGIN PKG_BASE_SIZE_CMS.GET_TB_BASE_SIZE_BY_ID(:sid,:sdata); END;";
    $id = '';
    if(isset($_GET['id']) && trim($_GET['id'])) $id = trim($_GET['id']);

    //data
    $result = get_data_by_id($conn, $sql, $id);
                    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;
}

if($get_cmd == 'getBaseSizeData'){
    //params
    $sql = "BEGIN PKG_BASE_SIZE_CMS.GET_TB_BASE_SIZE(:sstate,:sstart,:slength,:ssearch,:sordercol,:sorderdir,:stotal,:stotalfilter,:scursor); END;";

    $oder_col = "S_NAME";
    if($_GET['order'][0]['column'] == 0) $oder_col = "S_NAME";
    if($_GET['order'][0]['column'] == 1) $oder_col = "S_DESC";
    if($_GET['order'][0]['column'] == 2) $oder_col = "S_WIDTH";
    if($_GET['order'][0]['column'] == 3) $oder_col = "S_HEIGHT";
    if($_GET['order'][0]['column'] == 4) $oder_col = "S_SLEEVE";
    if($_GET['order'][0]['column'] == 5) $oder_col = "S_UNIT";
    if($_GET['order'][0]['column'] == 6) $oder_col = "N_POSITION";
    if($_GET['order'][0]['column'] == 7) $oder_col = "S_STATE";
    if($_GET['order'][0]['column'] == 8) $oder_col = "D_CREATE";
    if($_GET['order'][0]['column'] == 9) $oder_col = "D_UPDATE";

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



if($post_cmd == 'saveBaseSizeData'){
    //Check data
    $_POST['state'] = (trim($_POST['state']))?$_POST['state']:"approved";
    $_POST['unit'] = (trim($_POST['unit']))?$_POST['unit']:"inches";
    $_POST['position'] = (is_numeric($_POST['position']))?$_POST['position']:1;
    $_POST['width'] = (is_numeric($_POST['width']))?((strlen($_POST['width'])>4)?substr($_POST['width'],0,4):$_POST['width']):'';
    $_POST['height'] = (is_numeric($_POST['height']))?((strlen($_POST['height'])>4)?substr($_POST['height'],0,4):$_POST['height']):'';
    $_POST['sleeve'] = (is_numeric($_POST['sleeve']))?((strlen($_POST['sleeve'])>4)?substr($_POST['sleeve'],0,4):$_POST['sleeve']):'';

    if(isset($_POST['id']) && trim($_POST['id'])){
        //params
        $sql = "CALL PKG_BASE_SIZE_CMS.UPDATE_TB_BASE_SIZE(:sid,:sname,:sdesc,:sposition,:sstate,:swidth,:sheight,:ssleeve,:sunit)";
        $params = array(':sid'      => trim($_POST['id']),
                        ':sname'    => $_POST['name'],
                        ':sdesc'    => $_POST['desc'],
                        ':sposition'=> $_POST['position'],
                        ':sstate'   => $_POST['state'],
                        ':swidth'   => $_POST['width'],
                        ':sheight'  => $_POST['height'],
                        ':ssleeve'  => $_POST['sleeve'],
                        ':sunit'    => $_POST['unit']
                        );
        //data
        $result = update_data($conn, $sql, $params);
    }
    else{
        //params
        $sql = "CALL PKG_BASE_SIZE_CMS.INSERT_TB_BASE_SIZE(:sid,:sname,:sdesc,:sposition,:sstate,:swidth,:sheight,:ssleeve,:sunit)";
        $params = array(':sname'    => $_POST['name'],
                        ':sdesc'    => $_POST['desc'],
                        ':sposition'=> $_POST['position'],
                        ':sstate'   => $_POST['state'],
                        ':swidth'   => $_POST['width'],
                        ':sheight'  => $_POST['height'],
                        ':ssleeve'  => $_POST['sleeve'],
                        ':sunit'    => $_POST['unit']
                        );
        //data
        $result = insert_data($conn, $sql, $params);
    }
                    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;

    $log = array('action'   => (isset($_POST['id']) && trim($_POST['id']))?'update':'insert',
                 'uri'      => 'base-size',
                 'desc'     => $post_cmd.' id:'.$result);
}

if($post_cmd == 'removeBaseSizeData'){
    //params
    $sql = "CALL PKG_BASE_SIZE_CMS.REMOVE_TB_BASE_SIZE(:sid)";
    $id = '';
    if(isset($_POST['id']) && trim($_POST['id'])) $id = trim($_POST['id']);

    $result = remove_data($conn, $sql, $id);
    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;

    $log = array('action'   => 'delete',
                 'uri'      => 'base-size',
                 'desc'     => $post_cmd.' id:'.$id);
}

if($get_cmd == 'getBaseColorDataById'){
    //params
    $sql = "BEGIN PKG_BASE_COLOR_CMS.GET_TB_BASE_COLOR_BY_ID(:sid,:sdata); END;";
    $id = '';
    if(isset($_GET['id']) && trim($_GET['id'])) $id = trim($_GET['id']);

    //data
    $result = get_data_by_id($conn, $sql, $id);
                    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;
}

if($get_cmd == 'getBaseColorData'){
    //params
    $sql = "BEGIN PKG_BASE_COLOR_CMS.GET_TB_BASE_COLOR(:sstate,:sstart,:slength,:ssearch,:sordercol,:sorderdir,:stotal,:stotalfilter,:scursor); END;";

    $oder_col = "S_NAME";
    if($_GET['order'][0]['column'] == 0) $oder_col = "S_NAME";
    if($_GET['order'][0]['column'] == 1) $oder_col = "S_DESC";
    if($_GET['order'][0]['column'] == 2) $oder_col = "S_VALUE";
    if($_GET['order'][0]['column'] == 3) $oder_col = "N_POSITION";
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
    $result = get_table_data($conn, $sql, $params);
                    
    echo json_encode($result);
}

if($post_cmd == 'saveBaseColorData'){
    //Check data
    $_POST['state'] = (trim($_POST['state']))?$_POST['state']:"approved";
    $_POST['position'] = (is_numeric($_POST['position']))?$_POST['position']:1;
    $_POST['value'] = (strlen($_POST['value'])>32)?substr($_POST['value'],0,32):$_POST['value'];

    if(isset($_POST['id']) && trim($_POST['id'])){
        //params
        $sql = "CALL PKG_BASE_COLOR_CMS.UPDATE_TB_BASE_COLOR(:sid,:sname,:sdesc,:sposition,:sstate,:svalue)";
        $params = array(':sid'      => trim($_POST['id']),
                        ':sname'    => $_POST['name'],
                        ':sdesc'    => $_POST['desc'],
                        ':sposition'=> $_POST['position'],
                        ':sstate'   => $_POST['state'],
                        ':svalue'   => $_POST['value']
                        );
        //data
        $result = update_data($conn, $sql, $params);
    }
    else{
        //params
        $sql = "CALL PKG_BASE_COLOR_CMS.INSERT_TB_BASE_COLOR(:sid,:sname,:sdesc,:sposition,:sstate,:svalue)";
        $params = array(':sname'    => $_POST['name'],
                        ':sdesc'    => $_POST['desc'],
                        ':sposition'=> $_POST['position'],
                        ':sstate'   => $_POST['state'],
                        ':svalue'   => $_POST['value']
                        );
        //data
        $result = insert_data($conn, $sql, $params);
    }
                    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;

    $log = array('action'   => (isset($_POST['id']) && trim($_POST['id']))?'update':'insert',
                 'uri'      => 'base-color',
                 'desc'     => $post_cmd.' id:'.$result);
}

if($post_cmd == 'removeBaseColorData'){
    //params
    $sql = "CALL PKG_BASE_COLOR_CMS.REMOVE_TB_BASE_COLOR(:sid)";
    $id = '';
    if(isset($_POST['id']) && trim($_POST['id'])) $id = trim($_POST['id']);
    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;

    $log = array('action'   => 'delete',
                 'uri'      => 'base-color',
                 'desc'     => $post_cmd.' id:'.$id);
}

if($get_cmd == 'getBaseGroupDataById'){
    //params
    $sql = "BEGIN PKG_BASE_GROUP_CMS.GET_TB_BASE_GROUP_BY_ID(:sid,:sdata); END;";
    $id = '';
    if(isset($_GET['id']) && trim($_GET['id'])) $id = trim($_GET['id']);

    //data
    $result = get_data_by_id($conn, $sql, $id);
    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;
}

if($get_cmd == 'getBaseGroupData'){
    //params
    $sql = "BEGIN PKG_BASE_GROUP_CMS.GET_TB_BASE_GROUP(:sstate,:sstart,:slength,:ssearch,:sordercol,:sorderdir,:stotal,:stotalfilter,:scursor); END;";

    $oder_col = "S_NAME";
    if($_GET['order'][0]['column'] == 0) $oder_col = "S_NAME";
    if($_GET['order'][0]['column'] == 1) $oder_col = "S_DESC";
    if($_GET['order'][0]['column'] == 2) $oder_col = "N_POSITION";
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

if($get_cmd == 'getBaseGroupCombo'){
    //params
    $sql = "BEGIN PKG_BASE_GROUP_CMS.GET_TB_BASE_GROUP_COMBO(:sdata); END;";

    //data
    $result = get_combo_data($conn, $sql, null);
    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;
}

if($post_cmd == 'saveBaseGroupData'){
    //Check data
    $_POST['state'] = (trim($_POST['state']))?$_POST['state']:"approved";
    $_POST['position'] = (is_numeric($_POST['position']))?$_POST['position']:1;
    if(isset($_POST['id']) && trim($_POST['id'])){
        //params
        $sql = "CALL PKG_BASE_GROUP_CMS.UPDATE_TB_BASE_GROUP(:sid,:sname,:sdesc,:sposition,:sstate)";
        $params = array(':sid'      => trim($_POST['id']),
                        ':sname'    => $_POST['name'],
                        ':sdesc'    => $_POST['desc'],
                        ':sposition'=> $_POST['position'],
                        ':sstate'   => $_POST['state']
                        );
        //data
        $result = update_data($conn, $sql, $params);
    }
    else{
        //params
        $sql = "CALL PKG_BASE_GROUP_CMS.INSERT_TB_BASE_GROUP(:sid,:sname,:sdesc,:sposition,:sstate)";
        $params = array(':sname'    => $_POST['name'],
                        ':sdesc'    => $_POST['desc'],
                        ':sposition'=> $_POST['position'],
                        ':sstate'   => $_POST['state']
                        );
        //data
        $result = insert_data($conn, $sql, $params);
    }
                    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;

    $log = array('action'   => (isset($_POST['id']) && trim($_POST['id']))?'update':'insert',
                 'uri'      => 'base-group',
                 'desc'     => $post_cmd.' id:'.$result);
}

if($post_cmd == 'removeBaseGroupData'){
    //params
    $sql = "CALL PKG_BASE_GROUP_CMS.REMOVE_TB_BASE_GROUP(:sid)";
    $id = '';
    if(isset($_POST['id']) && trim($_POST['id'])) $id = trim($_POST['id']);

    $result = remove_data($conn, $sql, $id);
    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;

    $log = array('action'   => 'delete',
                 'uri'      => 'base-group',
                 'desc'     => $post_cmd.' id:'.$id);
}

if($get_cmd == 'getBase_BaseSizeData'){
    //params
    $sql = "BEGIN PKG_BASE_CMS.GET_TB_BASE_SIZE(:sbaseid,:sstart,:slength,:ssearch,:sordercol,:sorderdir,:stotal,:stotalfilter,:scursor); END;";

    $oder_col = "S_NAME";

    $params = array(':sbaseid'  => $_GET['base_id'],
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
if($get_cmd == 'getBase_BaseSizeAvailableData'){
    //params
    $sql = "BEGIN PKG_BASE_CMS.GET_TB_BASE_SIZE_AVAILABLE(:sbaseid,:sstart,:slength,:ssearch,:sordercol,:sorderdir,:stotal,:stotalfilter,:scursor); END;";

    $oder_col = "S_NAME";

    $params = array(':sbaseid'   => $_GET['base_id'],
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

if($post_cmd == 'saveBase_BaseSizeData'){
    //params
    $sql = "CALL PKG_BASE_CMS.UPDATE_TB_BASE_SIZE(:sid,:ssize)";
    
    $params = array(':sid'          => trim($_POST['id']),
                    ':ssize'        => $_POST['sizes']
                    );
                    
    //data
    $result = update_data($conn, $sql, $params);
                    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;

    $log = array('action'   => 'update',
                 'uri'      => 'base',
                 'desc'     => $post_cmd.' id:'.$result);
}

if($get_cmd == 'getBase_BaseColorData'){
    //params
    $sql = "BEGIN PKG_BASE_CMS.GET_TB_BASE_COLOR(:sbaseid,:sstart,:slength,:ssearch,:sordercol,:sorderdir,:stotal,:stotalfilter,:scursor); END;";

    $oder_col = "S_NAME";

    $params = array(':sbaseid'   => $_GET['base_id'],
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

if($get_cmd == 'getBase_BaseColorAvailableData'){
    //params
    $sql = "BEGIN PKG_BASE_CMS.GET_TB_BASE_COLOR_AVAILABLE(:sbaseid,:sstart,:slength,:ssearch,:sordercol,:sorderdir,:stotal,:stotalfilter,:scursor); END;";

    $oder_col = "S_NAME";

    $params = array(':sbaseid'   => $_GET['base_id'],
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

if($post_cmd == 'saveBase_BaseColorData'){
    //params
    $sql = "CALL PKG_BASE_CMS.UPDATE_TB_BASE_Color(:sid,:scolor)";
    
    $params = array(':sid'          => trim($_POST['id']),
                    ':scolor'        => $_POST['colors']
                    );
                    
    //data
    $result = update_data($conn, $sql, $params);
                    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;

    $log = array('action'   => 'update',
                 'uri'      => 'base',
                 'desc'     => $post_cmd.' id:'.$result);
}

if($get_cmd == 'getShippingFeeDataById'){
    //params
    $sql = "BEGIN PKG_SHIPPING_FEE_CMS.GET_TB_SHIPPING_FEE_BY_ID(:sid,:sdata); END;";
    $id = '';
    if(isset($_GET['id']) && trim($_GET['id'])) $id = trim($_GET['id']);

    //data
    $result = get_data_by_id($conn, $sql, $id);
                    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;
}

if($get_cmd == 'getShippingFeeData'){
    //params
    $sql = "BEGIN PKG_SHIPPING_FEE_CMS.GET_TB_SHIPPING_FEE(:sstate,:sstart,:slength,:ssearch,:sordercol,:sorderdir,:stotal,:stotalfilter,:scursor); END;";

    $oder_col = "TYPE_NAME";
    if($_GET['order'][0]['column'] == 0) $oder_col = "TYPE_NAME";
    if($_GET['order'][0]['column'] == 1) $oder_col = "S_COUNTRY_CODE";
    if($_GET['order'][0]['column'] == 2) $oder_col = "S_PRICE";
    if($_GET['order'][0]['column'] == 3) $oder_col = "S_STATE";

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



if($post_cmd == 'saveShippingFeeData'){
    //check data
    $_POST['state'] = (trim($_POST['state']))?$_POST['state']:"approved";
    $_POST['price'] = (is_numeric($_POST['price']))?$_POST['price']:0;

    if(isset($_POST['id']) && trim($_POST['id'])){
        //params
        $sql = "CALL PKG_SHIPPING_FEE_CMS.UPDATE_TB_SHIPPING_FEE(:sid,:stypeid,:scountrycode,:sprice,:scurrency,:sstate)";
        $params = array(':sid'      => trim($_POST['id']),
                        ':stypeid'  => $_POST['type'],
                        ':scountrycode' => $_POST['countrycode'],
                        ':sprice'   => $_POST['price'],
                        ':scurrency'=> $_POST['currency'],
                        ':sstate'   => $_POST['state']
                        );
        //data
        $result = update_data($conn, $sql, $params);
    }
    else{
        //params
        $sql = "CALL PKG_SHIPPING_FEE_CMS.INSERT_TB_SHIPPING_FEE(:sid,:stypeid,:scountrycode,:sprice,:scurrency,:sstate)";
        $params = array(':stypeid'  => $_POST['type'],
                        ':scountrycode' => $_POST['countrycode'],
                        ':sprice'   => $_POST['price'],
                        ':scurrency'=> $_POST['currency'],
                        ':sstate'   => $_POST['state']
                        );
        //data
        $result = insert_data($conn, $sql, $params);
    }
                    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;

    $log = array('action'   => (isset($_POST['id']) && trim($_POST['id']))?'update':'insert',
                 'uri'      => 'shipping-fee',
                 'desc'     => $post_cmd.' id:'.$result);
}

if($post_cmd == 'removeShippingFeeData'){
    
    //params
    $sql = "CALL PKG_SHIPPING_FEE_CMS.REMOVE_TB_SHIPPING_FEE(:sid)";
    $id = '';
    if(isset($_POST['id']) && trim($_POST['id'])) $id = trim($_POST['id']);

    $result = remove_data($conn, $sql, $id);

    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;

    $log = array('action'   => 'delete',
                 'uri'      => 'shipping-fee',
                 'desc'     => $post_cmd.' id:'.$id);
}

if($get_cmd == 'getCountryCombo'){
    //params
    $sql = "BEGIN PKG_COUNTRY_CMS.GET_TB_COUNTRY_COMBO(:sdata); END;";

    //data
    $result = get_combo_data($conn_user, $sql, null);
    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;
}

require_once(ROOTPATH . '/modules/inc/functions/db_log.php');
?>