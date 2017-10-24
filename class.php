<?php
//define smarty
require_once(ROOTPATH . '/resource/smarty/Smarty.class.php');
$smarty = new Smarty();

$smarty->template_dir = ROOTPATH . '/resource/smarty/templates';
$smarty->compile_dir = ROOTPATH . '/resource/smarty/templates_c';
$smarty->cache_dir = ROOTPATH . '/resource/smarty/cache';
$smarty->config_dir = ROOTPATH . '/resource/smarty/configs';

//define root URL
$smarty->assign("rooturl", ROOTURL);
$smarty->assign("rootpath", ROOTPATH);

?>