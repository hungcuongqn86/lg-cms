<?php

if(isset($_GET["view"]) && $_GET["view"]=="logout"){
    if(isset($_SESSION)){
        $_SESSION = array();
        session_destroy();
    }
    
    if(isset($_COOKIE["cookie_check_remember_me"]) && $_COOKIE["cookie_check_remember_me"]) $smarty->assign("cookie_check_remember_me", $_COOKIE["cookie_check_remember_me"]);
    if(isset($_COOKIE["cookie_email"]) && $_COOKIE["cookie_email"]) $smarty->assign("cookie_email", $_COOKIE["cookie_email"]);
    if(isset($_COOKIE["cookie_pwd"]) && $_COOKIE["cookie_pwd"]) $smarty->assign("cookie_pwd", $_COOKIE["cookie_pwd"]);

    $smarty->display(ROOTPATH."/login/login.html");
    exit();
}
else if(isset($_SESSION["login_success"]) && $_SESSION["login_success"] == true){
    
}
else if(isset($_POST["email"]) && isset($_POST["pwd"])){
    $login_success = false;

    require_once(ROOTPATH . '/modules/inc/functions/db_general.php');

    //params
    $sql = "BEGIN PKG_USER_CMS.CHECK_USER_LOGIN(:semail,:spassword,:sdata); END;";

    $params = array(':semail'     => $_POST["email"],
                    ':spassword'  => md5($_POST["pwd"])
                    );
    //data
    $result = get_data($conn_user, $sql, $params);
    
    if($result && $result[0] && $result[0]["S_ID"]){
        $_SESSION["user"] = array("id"      => $result[0]["S_ID"],
                                  "email"   => $result[0]["S_EMAIL"],
                                  "name"    => $result[0]["S_NAME"],
                                  "avatar"  => $result[0]["S_AVATAR"],
                                  "mobile"  => $result[0]["S_MOBILE"],
                                  "country" => $result[0]["COUNTRY_NAME"]
                                  );
        $login_success = true;
    }

    $_SESSION["login_success"] = $login_success;
    if(isset($_POST["remember_me"]) && $_POST["remember_me"]){
        setcookie("cookie_check_remember_me", true, time()+ 3600*24*365, "/");
        setcookie("cookie_email", $_POST["email"], time()+ 60*60*24*365, "/" );
        setcookie("cookie_pwd", $_POST["pwd"], time()+ 60*60*24*365, "/" );
    }
    else{
        setcookie("cookie_check_remember_me", false, time() - 3600, "/");
        setcookie("cookie_email", false, time() - 3600, "/");
        setcookie("cookie_pwd", false, time() - 3600, "/");
    }
    
    if($login_success == false){
        $smarty->assign("cookie_check_remember_me", (isset($_POST["remember_me"]))?(int)$_POST["remember_me"]:0);
        $smarty->assign("cookie_email", $_POST["email"]);
        $smarty->assign("cookie_pwd", $_POST["pwd"]);
        $smarty->assign("login_error", true);

        $smarty->display(ROOTPATH."/login/login.html");
        exit();
    }
    else{
        //go to index.html
    }
}
else{
    if(isset($_COOKIE["cookie_check_remember_me"]) && $_COOKIE["cookie_check_remember_me"]) $smarty->assign("cookie_check_remember_me", $_COOKIE["cookie_check_remember_me"]);
    if(isset($_COOKIE["cookie_email"]) && $_COOKIE["cookie_email"]) $smarty->assign("cookie_email", $_COOKIE["cookie_email"]);
    if(isset($_COOKIE["cookie_pwd"]) && $_COOKIE["cookie_pwd"]) $smarty->assign("cookie_pwd", $_COOKIE["cookie_pwd"]);
    if(isset($_GET["module"])) $_SESSION["module"] = $_GET["module"];
    
    $smarty->display(ROOTPATH."/login/login.html");
    exit();
}
?>