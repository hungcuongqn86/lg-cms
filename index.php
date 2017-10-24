<?php

include('config.php');
include('class.php');
include('login/login.php');

require_once(ROOTPATH . '/modules/inc/functions/db_general.php');

//return current date in server
$smarty->assign("curr_date_value", date('m/d/Y H:i A'));

//params
$sql = "BEGIN PKG_USER_CMS.GET_USER_ROLE(:sid,:sdata); END;";
$params = array(':sid' => $_SESSION["user"]["id"]);

//Get user role
if(isset($_SESSION["user_role"])) $user_role = $_SESSION["user_role"];
else{
    $user_role = array();
    $roles = get_data($conn_user, $sql, $params);
    if(count($roles)){
        foreach($roles as $role){
            $user_role[] = $role['S_URL'];
        }
    }
    $_SESSION["user_role"] = $user_role;
}
$smarty->assign("user_role", $user_role);

$module = (isset($_GET["module"]))?$_GET["module"]:((isset($_SESSION["module"]))?$_SESSION["module"]:"");
//clear session module
if(isset($_SESSION["module"])) $_SESSION["module"] = '';

$access_limit_echo = "You don't have permission to access this module. Click <a href=\"javascript: history.go(-1)\">here</a> to go back to the previous page or click <a href=\"".$rooturl."index.php?view=logout\">here</a> to login different account.";

//check user role
if(!count($user_role)){
    echo $access_limit_echo;
    return;
}
elseif($module == ''){
    if(!in_array('reports-dashboard', $user_role)){
        $module = $user_role[0];
    }
    else{
        $module = 'reports-dashboard';
    }
}
elseif(!in_array($module, $user_role)){
    echo $access_limit_echo;
    return;
}

$menu_arr = explode("-", $module);
$menu = $menu_arr[0];

$smarty->assign("menu", $menu);
$smarty->assign("module", $module);

//array portal module
$portal_module = array('printer');

if(in_array($module, $portal_module)){ //go to burger portal
    $smarty->display(ROOTPATH."/portals/index.html");
}
else{ //go to burger cms
    $smarty->display(ROOTPATH."/index.html");
}

?>