<?php

/*
 * get data
 *
 */
function get_data($conn, $sql, $params){
    $return = false;
    /* Parse connection and sql */
    $stid = oci_parse($conn, $sql);

    /* Binding Parameters */
    $curs = oci_new_cursor($conn);
    oci_bind_by_name($stid, ':sdata', $curs, -1, OCI_B_CURSOR);

    if($params){
        foreach ($params as $key => $value){
            oci_bind_by_name($stid, $key, $params[$key]);
        }
    }
    
    if(!oci_execute($stid)){
        $error = oci_error();
        echo $error["message"];
        exit();
    }
    oci_execute($curs);
    $nrows = oci_fetch_all($curs, $res, null, null, OCI_FETCHSTATEMENT_BY_ROW);
    $return = $res;
    
    oci_free_statement($curs);
    oci_free_statement($stid);

    //Format date
    $date_field_arr = array("DD_CREATE", "DD_UPDATE", "DD_START", "DD_END");
    for($i = 0; $i < count($return); $i++){
        foreach ($return[$i] as $key => $value){
            if(in_array($key, $date_field_arr)){
                if($value)
                $return[$i][$key] = date(DATE_FORMAT, strtotime($value));
            }
        }
    }

    return $return;
}

/*
 * get data by id
 *
 */
function get_data_by_id($conn, $sql, $id){
    $return = false;
    if(trim($id)){
        /* Parse connection and sql */
        $stid = oci_parse($conn, $sql);

        /* Binding Parameters */
        $curs = oci_new_cursor($conn);
        oci_bind_by_name($stid, ':sid', $id);
        oci_bind_by_name($stid, ':sdata', $curs, -1, OCI_B_CURSOR);
        
        if(!oci_execute($stid)){
            $error = oci_error();
            echo $error["message"];
            exit();
        }
        oci_execute($curs);
        $nrows = oci_fetch_all($curs, $res, null, null, OCI_FETCHSTATEMENT_BY_ROW);
        $return = $res;
        
        oci_free_statement($curs);
        oci_free_statement($stid);

        //Format date
        $date_field_arr = array("DD_CREATE", "DD_UPDATE", "DD_START", "DD_END");
        for($i = 0; $i < count($return); $i++){
            foreach ($return[$i] as $key => $value){
                if(in_array($key, $date_field_arr)){
                    if($value)
                    $return[$i][$key] = date(DATE_FORMAT, strtotime($value));
                }
            }
        }
    }
    
    return $return;
}

/*
 * get combo data
 *
 */
function get_combo_data($conn, $sql, $params){
    $return = false;
    /* Parse connection and sql */
    $stid = oci_parse($conn, $sql);

    /* Binding Parameters */
    $curs = oci_new_cursor($conn);
    oci_bind_by_name($stid, ':sdata', $curs, -1, OCI_B_CURSOR);
    if($params){
        foreach ($params as $key => $value){
            oci_bind_by_name($stid, $key, $params[$key]);
        }
    }
    
    if(!oci_execute($stid)){
        $error = oci_error();
        echo $error["message"];
        exit();
    }
    oci_execute($curs);
    $nrows = oci_fetch_all($curs, $res, null, null, OCI_FETCHSTATEMENT_BY_ROW);
    $return = $res;
    
    oci_free_statement($curs);
    oci_free_statement($stid);

    return $return;
}

/*
 * get table data
 *
 */
function get_table_data($conn, $sql, $params){
    $return = false;
    /* Parse connection and sql */
    $stid = oci_parse($conn, $sql);
    
    /* Binding Parameters */
    $curs = oci_new_cursor($conn);
    $total = 0;
    $total_filter = 0;
    
    foreach ($params as $key => $value){
        oci_bind_by_name($stid, $key, $params[$key]);
    }
    
    oci_bind_by_name($stid, ':stotal', $total, 10);
    oci_bind_by_name($stid, ':stotalfilter', $total_filter, 10);
    oci_bind_by_name($stid, ':scursor', $curs, -1, OCI_B_CURSOR);
    
    if(!oci_execute($stid)){
        $error = oci_error();
        echo $error["message"];
        exit();
    }
    oci_execute($curs);
    $nrows = oci_fetch_all($curs, $res, null, null, OCI_FETCHSTATEMENT_BY_ROW);
    $data = $res;
    
    oci_free_statement($curs);
    oci_free_statement($stid);
    
    //Format date
    $date_field_arr = array("DD_CREATE", "DD_UPDATE", "DD_START", "DD_END", "DD_EXPIRE");
    for($i = 0; $i < count($data); $i++){
        foreach ($data[$i] as $key => $value){
            if(in_array($key, $date_field_arr)){
                if($value)
                $data[$i][$key] = date(DATE_FORMAT, strtotime($value));
            }
        }
    }

    $return = array("draw"            => $_GET['draw'],
                    "recordsTotal"    => $total,
                    "recordsFiltered" => $total_filter,
                    "data"            => json_decode(json_encode($data)));
    return $return;
}

/*
 * get table data
 *
 */
function get_data_list($conn, $sql, $params){
    /* Parse connection and sql */
    $stid = oci_parse($conn, $sql);
    /* Binding Parameters */
    $curs = oci_new_cursor($conn);
    $total_filter = 0;

    foreach ($params as $key => $value){
        oci_bind_by_name($stid, $key, $params[$key]);
    }

    oci_bind_by_name($stid, ':stotalfilter', $total_filter, 10);
    oci_bind_by_name($stid, ':scursor', $curs, -1, OCI_B_CURSOR);

    if(!oci_execute($stid)){
        $error = oci_error();
        echo $error["message"];
        exit();
    }
    oci_execute($curs);
    $nrows = oci_fetch_all($curs, $res, null, null, OCI_FETCHSTATEMENT_BY_ROW);
    $data = $res;

    oci_free_statement($curs);
    oci_free_statement($stid);

    //Format date
    $date_field_arr = array("DD_CREATE", "DD_UPDATE", "DD_START", "DD_END");
    for($i = 0; $i < count($data); $i++){
        foreach ($data[$i] as $key => $value){
            if(in_array($key, $date_field_arr)){
                if($value)
                    $data[$i][$key] = date(DATE_FORMAT, strtotime($value));
            }
        }
    }

    $return = array("recordsFiltered" => $total_filter, "data" => json_decode(json_encode($data)));
    return $return;
}

/*
 * insert data
 *
 */
function insert_data($conn, $sql, $params){
    $return = false;
    /* Parse connection and sql */
    $stid = oci_parse($conn, $sql);
    
    /* Binding Parameters */
    $id = 0;
    oci_bind_by_name($stid, ":sid", $id, 32);
    foreach ($params as $key => $value){
        oci_bind_by_name($stid, $key, $params[$key]);
    }
    
    if(!oci_execute($stid)){
        $error = oci_error();
        echo $error["message"];
        exit();
    }
    $return = $id;

    oci_free_statement($stid);

    return $return;
}

/*
 * update data
 *
 */
function update_data($conn, $sql, $params){
    $return = false;
    /* Parse connection and sql */
    $stid = oci_parse($conn, $sql);
    
    $id = $params[':sid'];
    
    /* Binding Parameters */
    foreach ($params as $key => $value){
        oci_bind_by_name($stid, $key, $params[$key]);
    }
    
    if(!oci_execute($stid)){
        $error = oci_error();
        echo $error["message"];
        exit();
    }
    $return = $id;

    oci_free_statement($stid);
    
    return $return;
}

/*
 * remove data
 *
 */
function remove_data($conn, $sql, $id){
    $return = false;
    /* Parse connection and sql */
    $stid = oci_parse($conn, $sql);
    /* Binding Parameters */
    oci_bind_by_name($stid, ':sid', $id);

    if(!oci_execute($stid)){
        $error = oci_error();
        echo $error["message"];
        exit();
    }
    $return = true;

    oci_free_statement($stid);
    
    return $return;
}

/*
 * assign data
 *
 */
function assign_data($conn, $sql, $params){
    $return = false;
    /* Parse connection and sql */
    $stid = oci_parse($conn, $sql);
    
    /* Binding Parameters */
    foreach ($params as $key => $value){
        oci_bind_by_name($stid, $key, $params[$key]);
    }
    
    if(!oci_execute($stid)){
        $error = oci_error();
        echo $error["message"];
        exit();
    }
    oci_free_statement($stid);
}

/*
 * search data
 *
 *param $include: null, "not_specified", "all"
 */
function search_data($conn, $sql, $params, $text, $include){
    $return = false;
    /* Parse connection and sql */
    $stid = oci_parse($conn, $sql);
    
    /* Binding Parameters */
    $curs = oci_new_cursor($conn);
    $total = 0;
    
    foreach ($params as $key => $value){
        oci_bind_by_name($stid, $key, $params[$key]);
    }
    
    oci_bind_by_name($stid, ':stotal', $total, 10);
    oci_bind_by_name($stid, ':scursor', $curs, -1, OCI_B_CURSOR);
    
    if(!oci_execute($stid)){
        $error = oci_error();
        echo $error["message"];
        exit();
    }
    oci_execute($curs);
    $nrows = oci_fetch_all($curs, $res, null, null, OCI_FETCHSTATEMENT_BY_ROW);
    $data = array();
    if($include && $params[":pagenumber"] == 0){
        if($include == "not_specified"){
            $data[] = array("id"    => '-',
                            "text"  => "-Not specified-");
        }
        if($include == "all"){
            $data[] = array("id"    => '-',
                            "text"  => "All");
        }
        
    }
    
    foreach ($res as $item){
        $data[] = array("id"    => $item["S_ID"],
                        "text"  => $item[$text]);
    }
    oci_free_statement($curs);
    oci_free_statement($stid);

    $return = array("total" => $total,
                    "items" => json_decode(json_encode($data)));
    return $return;
}

/*
 * check data
 *
 */
function check_data($conn, $sql, $params){
    $return = false;
    /* Parse connection and sql */
    $stid = oci_parse($conn, $sql);

    /* Binding Parameters */
    $check_temp = '';
    oci_bind_by_name($stid, ':scheck', $check_temp, 99999);
    foreach ($params as $key => $value){
        oci_bind_by_name($stid, $key, $params[$key]);
    }
    
    if(!oci_execute($stid)){
        $error = oci_error();
        echo $error["message"];
        exit();
    }
    
    oci_free_statement($stid);

    return $check_temp;
}

/*
 * get report data
 *
 */
function get_report_data($conn, $sql, $params, $data_out){
    $return = false;
    /* Parse connection and sql */
    $stid = oci_parse($conn, $sql);

    /* Binding Parameters */
    foreach ($params as $key => $value){
        oci_bind_by_name($stid, $key, $params[$key]);
    }
    foreach ($data_out as $key => $value){
        oci_bind_by_name($stid, $key, $data_out[$key], 32);
    }
    
    if(!oci_execute($stid)){
        $error = oci_error();
        echo $error["message"];
        exit();
    }
    
    oci_free_statement($stid);

    return $data_out;
}
?>