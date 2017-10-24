<?php
include('../../config.php');
include('../../class.php');
include(ROOTPATH.'/login/login.php');

$upload_path = UPLOADPATH;
$upload_url = UPLOADURL;
if(isset($_POST["type"]) && $_POST["type"] == 'mockup_front' || $_POST["type"] == 'mockup_back'){
    $upload_path = UPLOADPATH_MOCKUP;
    $upload_url = UPLOADURL_MOCKUP;
}

$return = false;
if ( isset($_FILES["file"]["type"]) ){
    $max_size = 2 * 1024 * 1024; // 2MB
    $destination_directory = $upload_path;
    $validextensions = array("jpeg", "jpg", "png");
    $temporary = explode(".", $_FILES["file"]["name"]);
    $file_extension = end($temporary);
    // We need to check for image format and size again, because client-side code can be altered
    if ((($_FILES["file"]["type"] == "image/png") ||
         ($_FILES["file"]["type"] == "image/jpg") ||
         ($_FILES["file"]["type"] == "image/jpeg")
        ) && in_array($file_extension, $validextensions))
    {
        if ( $_FILES["file"]["size"] < ($max_size) ){
            if ( $_FILES["file"]["error"] > 0 ){
                $return =  "Error: <strong>" . $_FILES["file"]["error"] . "</strong>";
            }
            else{
                $sourcePath = $_FILES["file"]["tmp_name"];
                if(isset($_POST["type"])){
                    $filename = "img_".time()."_".$_POST["type"].".".$file_extension;
                }
                else{
                    $filename = "img_".time().".".$file_extension;
                }
                
                $targetPath = $destination_directory . $filename;
                if(move_uploaded_file($sourcePath, $targetPath)){
                    $return = array("name" => $filename, 
                                    "src"  => $upload_url.$filename);
                }
                else{
                    $return = "Error: Problem upload file!";
                }
            }
        }
        else{
            $return = "Error: The size of image you are attempting to upload is " . round($_FILES["file"]["size"]/1024, 2) . " KB, maximum size allowed is " . round($max_size/1024, 2) . " KB";
        }
    }
    else{
        $return = "Error: Unvalid image format. Allowed formats: JPG, JPEG, PNG.";
    }
}

echo json_encode($return);