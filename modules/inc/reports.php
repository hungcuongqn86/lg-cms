<?php

include('../../config.php');
include('../../class.php');
include(ROOTPATH.'/login/login.php');

require_once(ROOTPATH . '/modules/inc/functions/db_general.php');

$get_cmd = isset ($_GET['cmd']) ? $_GET['cmd'] : null;
$post_cmd = isset ($_POST['cmd']) ? $_POST['cmd'] : null;

if($get_cmd == 'getOverview'){
    //params
    $sql = "BEGIN PKG_REPORTS_CMS.GET_OVERVIEW(:sstart,:send,:sdata); END;";
    
    $params = array(':sstart'    => $_GET['start'],
                    ':send'      => $_GET['end']
                    );

    //data
    $result = get_data($conn, $sql, $params);

    //params
    $sql = "BEGIN PKG_REPORTS_CMS.GET_OVERVIEW_CONV(:sstart,:send,:sdata); END;";
    
    $params = array(':sstart'    => $_GET['start'],
                    ':send'      => $_GET['end']
                    );

    //data
    $result2 = get_data($conn, $sql, $params);
                    
    $json_string = '{"result":'.json_encode($result).', "result2":'.json_encode($result2).'}';
    echo $json_string;
}

if($get_cmd == 'getTopAffiliates'){
    //params
    $sql = "BEGIN PKG_REPORTS_CMS.GET_TOP_AFFILIATES(:sstart,:send,:sdata); END;";
    
    $params = array(':sstart'    => $_GET['start'],
                    ':send'      => $_GET['end']
    );
    //data
    $result = get_data($conn, $sql, $params);
    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;
}

if($get_cmd == 'getTopCampaigns'){
    //params
    $sql = "BEGIN PKG_REPORTS_CMS.GET_TOP_CAMPAIGNS(:sstart,:send,:sdata); END;";

    $params = array(':sstart'    => $_GET['start'],
                    ':send'      => $_GET['end']
    );
    //data
    $result = get_data($conn, $sql, $params);
    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;
}

if($get_cmd == 'getTrafficOverview'){
    //params
    $sql = "BEGIN PKG_REPORTS_CMS.GET_TRAFFIC_OVERVIEW(:sstart,:send,:sdata); END;";

    $params = array(':sstart'    => $_GET['start'],
                    ':send'      => $_GET['end']
    );

    //data
    $result = get_data($conn, $sql, $params);

    //params
    $sql2 = "BEGIN PKG_REPORTS_CMS.GET_ORDER_MAP(:sstart,:send,:sdata); END;";
    
    //data
    $result2 = get_data($conn, $sql2, $params);
    
    $json_string = '{"result":'.json_encode($result).',"result2":'.json_encode($result2).'}';
    echo $json_string;
}

if($get_cmd == 'getOrderStatics'){
    //sql
    $sql = "BEGIN PKG_REPORTS_CMS.GET_ORDER_REPORT(:sstart,:send,:sorder,:sorder_dir,:sdata); END;";

    //get recent order
    $params1 = array(':sorder'    => 'D_CREATE',
                     ':sorder_dir'=> 'desc',
                     ':sstart'    => $_GET['start'],
                     ':send'      => $_GET['end']
                    );
    //data
    $result1 = get_data($conn, $sql, $params1);

    //get recent order
    $params2 = array(':sorder'    => 'TOTAL_AMOUNT',
                     ':sorder_dir'=> 'desc',
                     ':sstart'    => $_GET['start'],
                     ':send'      => $_GET['end']
                    );
    //data
    $result2 = get_data($conn, $sql, $params2);

    //get recent order
    $params3 = array(':sorder'    => 'TOTAL_AMOUNT',
                     ':sorder_dir'=> 'asc',
                     ':sstart'    => $_GET['start'],
                     ':send'      => $_GET['end']
                    );
    //data
    $result3 = get_data($conn, $sql, $params3);

    //get most viewed
    $sql = "BEGIN PKG_REPORTS_CMS.GET_MOST_VIEWED(:sstart,:send,:sdata); END;";
    $params4 = array(':sstart'    => $_GET['start'],
                     ':send'      => $_GET['end']
    );
    //data
    $result4 = get_data($conn, $sql, $params4);
    
    $json_string = '{"result1":'.json_encode($result1).',"result2":'.json_encode($result2).',"result3":'.json_encode($result3).',"result4":'.json_encode($result4).'}';
    echo $json_string;
}

if($get_cmd == 'getAffiliatesData'){
    //params
    $sql = "BEGIN PKG_REPORTS_CMS.GET_AFFILIATES(:sstartdate,:senddate,:sstart,:slength,:ssearch,:sordercol,:sorderdir,:stotal,:stotalfilter,:scursor); END;";

    $oder_col = "TOTAL_SALE";
    if($_GET['order'][0]['column'] == 0) $oder_col = "USER_NAME";
    if($_GET['order'][0]['column'] == 1) $oder_col = "TOTAL_CAMPAIGN";
    if($_GET['order'][0]['column'] == 2) $oder_col = "TOTAL_SALE";
    if($_GET['order'][0]['column'] == 3) $oder_col = "REVENUE";
    if($_GET['order'][0]['column'] == 4) $oder_col = "TOTAL_TRAFFIC";

    $params = array(':sstartdate'=> $_GET['startdate'],
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

if($get_cmd == 'getCampaignsData'){
    //params
    $sql = "BEGIN PKG_REPORTS_CMS.GET_CAMPAIGNS(:sstartdate,:senddate,:sstart,:slength,:ssearch,:sordercol,:sorderdir,:stotal,:stotalfilter,:scursor); END;";

    $oder_col = "TOTAL_SALE";
    if($_GET['order'][0]['column'] == 4) $oder_col = "TOTAL_ORDER";
    if($_GET['order'][0]['column'] == 6) $oder_col = "TOTAL_TRAFFIC";

    $params = array(':sstartdate'=> $_GET['startdate'],
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

if($get_cmd == 'getOrderSelling'){
    //params
    $sql = "BEGIN PKG_REPORTS_CMS.GET_ORDER_SELLING(:show_col_country,:show_col_city,:sstart,:send,:sdata); END;";
    
    $params = array(':sstart'    => $_GET['start'],
                    ':send'      => $_GET['end'],
                    ':show_col_country'   => $_GET['show_col_country'],
                    ':show_col_city'      => $_GET['show_col_city'],
    );
    //data
    $result = get_data($conn, $sql, $params);
    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;
}

if($get_cmd == 'getRevenue'){
    //params
    $sql = "BEGIN PKG_REPORTS_CMS.GET_REVENUE(:show_col_country,:show_col_city,:sstart,:send,:sdata); END;";
    
    $params = array(':sstart'    => $_GET['start'],
                    ':send'      => $_GET['end'],
                    ':show_col_country'   => $_GET['show_col_country'],
                    ':show_col_city'      => $_GET['show_col_city'],
    );
    //data
    $result = get_data($conn, $sql, $params);
    
    $json_string = '{"result":'.json_encode($result).'}';
    echo $json_string;
}

if($get_cmd == 'getTrafficData'){
    //params
    $sql = "BEGIN PKG_REPORTS_CMS.GET_TRAFFIC(:sstartdate,:senddate,:sstart,:slength,:ssearch,:sordercol,:sorderdir,:stotal,:stotalfilter,:scursor); END;";

    $oder_col = "TOTAL_SALE";
    if($_GET['order'][0]['column'] == 4) $oder_col = "TOTAL_TRAFFIC";

    $params = array(':sstartdate'=> $_GET['startdate'],
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

if($get_cmd == 'getTrafficLocationData'){
    //params
    $sql = "BEGIN PKG_REPORTS_CMS.GET_TRAFFIC_LOCATION(:sstartdate,:senddate,:sstart,:slength,:ssearch,:sordercol,:sorderdir,:stotal,:stotalfilter,:scursor); END;";

    $oder_col = "TOTAL_SALE";
    if($_GET['order'][0]['column'] == 3) $oder_col = "TOTAL_TRAFFIC";

    $params = array(':sstartdate'=> $_GET['startdate'],
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
?>