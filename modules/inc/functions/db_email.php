<?php
function db_get_template_printing ($tpl_name, &$tpl_source, &$smarty_obj){

    include(ROOTPATH.'/config.php');

    $sql = "BEGIN PKG_PRODUCT_PRINTING_CMS.GET_EMAIL_TEMPLATE_CONTENT(:stype,:scheck); END;";
    $params = array(':stype' => 'order_printing');
    $email_temp_content = check_data($conn_cms, $sql, $params);
    $tpl_source = $email_temp_content;
    // return true on success, false to generate failure notification
    return true;
}

function db_get_template_shipping ($tpl_name, &$tpl_source, &$smarty_obj){

    include(ROOTPATH.'/config.php');

    $sql = "BEGIN PKG_PRODUCT_PRINTING_CMS.GET_EMAIL_TEMPLATE_CONTENT(:stype,:scheck); END;";
    $params = array(':stype' => 'order_shipping');
    $email_temp_content = check_data($conn_cms, $sql, $params);
    $tpl_source = $email_temp_content;
    // return true on success, false to generate failure notification
    return true;
}

function db_get_timestamp($tpl_name, &$tpl_timestamp, &$smarty_obj)
{
    // do database call here to populate $tpl_timestamp
    // with unix epoch time value of last template modification.
    // This is used to determine if recompile is necessary.
    $tpl_timestamp = time(); // this example will always recompile!
    // return true on success, false to generate failure notification
    return true;
}

function db_get_secure($tpl_name, &$smarty_obj)
{
    // assume all templates are secure
    return true;
}

function db_get_trusted($tpl_name, &$smarty_obj)
{
    // not used for templates
}
?>