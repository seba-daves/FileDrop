<?php
/*

-- CONFIGURATION SECTION --

*/
/*Server's Domain or IP Address*/ $FQDN="localhost";
/*Server's Protocol*/             $PROTO="https://";
/*Path to the uploads folder*/    $UPLOADS="../../uploads/";
/*Email username*/                $SRVEMAIL="bot@example.com";
/*

---------------------------

*/
error_reporting(E_ERROR | E_PARSE);
error_reporting(0);
include_once('./incls.php');
switch($_REQUEST['action']){
    case "upload":
        if(CheckAuth()){
            $filename = mysqli_real_escape_string($conn,$_FILES['file']['name']);
            $tempname = $_FILES['file']['tmp_name'];
            $size = $_FILES['file']['size'];

            $name = $_FILES['file']['name'];
            $ext = end((explode(".", $name)));
    
            $fecha = new DateTime();
            $newName = $fecha->getTimestamp();
    
            $folder = $UPLOADS.$newName.'.'.$ext;
            if(move_uploaded_file($tempname,$folder)){
                $new=$newName ."." .$ext;
                $old = $filename;
                $query = "INSERT INTO `files` (`User`,`Code`,`Name`,`Title`,`Size`) VALUES (" .$_SESSION['uid'] .",'$newName','$new', '$old', '$size')";
                $res=mysqli_query($conn,$query);
                header('Location: ../index.html?upcode='.$newName);
            }else{
                header('Location: ../index.html?res=noupload');
            }
        }else{
            header('Location: ../index.html?res=nologin');
        }
        break;
    case "new-note":
            if(CheckAuth()){
                $noteName = "Note ".date("d/m/Y H:i:s") .".txt";
        
                $fecha = new DateTime();
                $newName = $fecha->getTimestamp();
        
                $folder = $UPLOADS.$newName.'.txt';

                $noteFile=fopen($folder, "a");
                fwrite($noteFile, $_REQUEST['note-text']);
                fclose($noteFile);

                $new=$newName .".txt";
                $old = $noteName;
                $size=filesize($folder);
                $query = "INSERT INTO `files` (`User`,`Code`,`Name`,`Title`,`Size`) VALUES (" .$_SESSION['uid'] .",'$newName','$new', '$old', '$size')";
                $res=mysqli_query($conn,$query);
                header('Location: ../index.html?notecode='.$newName);
            }else{
                header('Location: ../index.html?res=nologin');
            }
        break;
    case "revokesessions":
        if(CheckAuth()){
            session_start();
            $uid=$_SESSION['uid'];
            $query = "INSERT INTO `revoked-sessions` (`User`,`BeforeTime`) VALUES (" .$_SESSION['uid'] .",'" .time() ."')";
            $res=mysqli_query($conn,$query);
            $_SESSION['uid']="";
            session_destroy();
            header('Location: ../index.html');
        }else{
            header('Location: ../index.html?res=nologin');
        }
        break;
    case "loginsdata":
        if(CheckAuth()){
            session_start();
            $uid=$_SESSION['uid'];
            echo LoginsData($uid);
        }else{
            header('Location: ../index.html?res=nologin');
        }
        break;
    case "login":
        if(isset($_REQUEST['email']) && isset($_REQUEST['password'])){
            $email = mysqli_real_escape_string($conn,$_REQUEST['email']);
            $query="SELECT * FROM `filedrop-users` WHERE `mail`= '$email'";
            $res = mysqli_query($conn,$query);
            $dat = mysqli_fetch_assoc($res);
            if(password_verify($_REQUEST['password'],$dat['hash'])){
                $to=$dat['mail'];
                $link="http://ip-api.com/json/".$_SERVER['REMOTE_ADDR'];
                $IPdata=file_get_contents($link);
                $data = json_decode($IPdata);
                $IPLocationString = ($data->regionName) .", " .($data->country) . " " .($data->isp);
                $IPLocationString = htmlspecialchars($IPLocationString);
                $IPLocationString = mysqli_real_escape_string($conn,$IPLocationString);

                $message='<!DOCTYPE html>
                <html lang="en" xmlns="http://www.w3.org/1999/xhtml">
                <head>
                    <meta charset="utf-8">
                </head>
                <body style="margin:auto;text-align:center;">
                    <center>
                        <img src="'.$PROTO .$FQDN .'/img/band.png" width="520px">
                        <table style="text-align:center;">
                        <tbody>
                            <tr>
                                <th>
                                    <br/>
                                    <br/>
                                    <img style="width:200px;" src="'.$PROTO .$FQDN .'/img/logo.png" width="160px">
                                </th>
                            </tr>
                            <tr>
                                <td>&nbsp;</td>
                            </tr>
                            <tr>
                                <td>
                                    We Have Registered a New Login From The IP <b>'.htmlspecialchars($_SERVER['REMOTE_ADDR']) .'</b>
                                </td>
                            </tr>
                            <tr>
                            <td>
                                Location and ISP: <b>'.$IPLocationString .'</b>
                            </td>
                            </tr>
                            <tr>
                            <td style="font-size:10pt;max-width:400px">
                                <br/>
                                <br/>
                                User Agent:<br/><br/>'.htmlspecialchars($_SERVER['HTTP_USER_AGENT']) .'
                            </td>
                            </tr>
                        </tbody>
                        </table>
                        <img src="'.$PROTO .$FQDN .'/img/bandbot.png" width="520px">
                </center>
                </body>
                </html>';
                $headers= 'From: ' .$SRVEMAIL .'' ."\r\n" ."Content-type: text/html \r\n";
                $subject="FileDrop - New Login"; 
                $message=preg_replace("/(\s*[\r\n]+\s*|\s+)/", ' ', $message);
                mail($to,$subject,$message,$headers);
                session_start();
                $_SESSION['uid']=$dat['ID'];
                $_SESSION['login-time']=time();
                $query="INSERT INTO `access-logs` (`User`,`IP`,`Location`,`UserAgent`,`Time`) VALUES(" .$dat['ID'] .", '" .mysqli_real_escape_string($conn,$_SERVER['REMOTE_ADDR']) ."', '".$IPLocationString."', '".mysqli_real_escape_string($conn,$_SERVER['HTTP_USER_AGENT'])."', '".time()."')";
                $res = mysqli_query($conn,$query);
                header('Location: ../index.html');
            }else{
                header('Location: ../index.html?res=wrong');
            }
        }
        break;
    case "logout":
        session_start();
        $_SESSION['uid']="";
        session_destroy();
        header('Location: ../index.html');
        break;
    case "search":
        if(isset($_REQUEST['id'])){
            $id = mysqli_real_escape_string($conn,$_REQUEST['id']);
            $query="SELECT * FROM `files` WHERE `Code`='$id'";
            $res = mysqli_query($conn,$query);
            $dat = mysqli_fetch_assoc($res);
            if($dat['ID']!=""){
                if($dat['Public']==1){
                    $ext = end((explode(".", $dat['Name'])));
                    $folder = $UPLOADS.$dat['Name'];
                    header("Pragma: public");
                    header("Expires: 0");
                    header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
                    header("Cache-Control: public");
                    header("Content-Description: File Transfer");
                    if($ext=="mp4"){
                        header("Content-Type: video/mp4");
                    }else{
                        header("Content-Type: $ext");
                    }
                    
                    header("Content-Disposition: attachment; filename=\"".$dat['Title']."\"");
                    header("Content-Transfer-Encoding: binary");
                    header("Accept-Ranges: bytes");
                    header("Content-Length: " . $dat['Size']);
    
                    $file = @fopen($folder,"rb");
                    if ($file) {
                    while(!feof($file)) {
                        print(fread($file, 1024*8));
                        flush();
                        if (connection_status()!=0) {
                        @fclose($file);
                        die();
                        }
                    }
                    @fclose($file);
                    }
                }else{
                    if(CheckAuth()){
                        if(isset($_REQUEST['id'])){
                            session_start();
                            $id = mysqli_real_escape_string($conn,$_REQUEST['id']);
                            $uid=$_SESSION['uid'];
                            $query="SELECT * FROM `files` WHERE `User`= $uid AND `Code`='$id'";
                            $res = mysqli_query($conn,$query);
                            $dat = mysqli_fetch_assoc($res);
                            if($dat['ID']!=""){
                                $ext = end((explode(".", $dat['Name'])));
                                $folder = $UPLOADS.$dat['Name'];
                                header("Pragma: public");
                                header("Expires: 0");
                                header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
                                header("Cache-Control: public");
                                header("Content-Description: File Transfer");
                                header("Content-Type: $ext");
                                header("Content-Disposition: attachment; filename=\"".$dat['Title']."\"");
                                header("Content-Transfer-Encoding: binary");
                                header("Content-Length: " . $dat['Size']);
                
                                $file = @fopen($folder,"rb");
                                if ($file) {
                                while(!feof($file)) {
                                    print(fread($file, 1024*8));
                                    flush();
                                    if (connection_status()!=0) {
                                    @fclose($file);
                                    die();
                                    }
                                }
                                @fclose($file);
                                }
                            }else{
                                header('Location: ../index.html?res=filenotfound');
                            }
                        }
                    }else{
                        header('Location: ../index.html?res=nologin');
                    }
                }
            }else{
               header('Location: ../index.html?res=filenotfound'); 
            }
        }
        break;
        case "list":
            if(CheckAuth()){
                session_start();
                $uid=$_SESSION['uid'];
                $ret = FilesData($uid);
                echo $ret;
            }else{
                header('Location: ../index.html?res=nologin');
            }
        break;
        case "delete":
            if(CheckAuth()){
                if(isset($_REQUEST['id'])){
                    session_start();
                    $id = mysqli_real_escape_string($conn,$_REQUEST['id']);
                    $uid=$_SESSION['uid'];
                    $query="SELECT * FROM `files` WHERE `User`= $uid AND `Code`='$id'";
                    $res = mysqli_query($conn,$query);
                    $dat = mysqli_fetch_assoc($res);
                    if (!unlink($UPLOADS.$dat['Name'])) { 
                        header('Location: ../index.html?res=nodelete');
                    } 
                    else { 
                        $query="DELETE FROM `files` WHERE `User`= $uid AND `Code`='$id'";
                        $res = mysqli_query($conn,$query);
                        header('Location: ../index.html');
                    } 
                }
            }else{
                header('Location: ../index.html?res=nologin');
            }
        break;
        case "share":
            if(CheckAuth()){
                if(isset($_REQUEST['id'])){
                    session_start();
                    $id = mysqli_real_escape_string($conn,$_REQUEST['id']);
                    $uid=$_SESSION['uid'];
                    $query="UPDATE `files` SET `Public` = 1 WHERE `User` = $uid AND Code = '$id' ;";
                    $res = mysqli_query($conn,$query);
                    header('Location: ../index.html?res=shared&id='.$id);
                }
            }else{
                header('Location: ../index.html?res=nologin');
            }
            break;
        case "unshare":
            if(CheckAuth()){
                if(isset($_REQUEST['id'])){
                    session_start();
                    $id = mysqli_real_escape_string($conn,$_REQUEST['id']);
                    $uid=$_SESSION['uid'];
                    $query="UPDATE `files` SET `Public` = 0 WHERE `User` = $uid AND Code =  '$id' ;";
                    $res = mysqli_query($conn,$query);
                    header('Location: ../index.html?unshared');
                }
            }else{
                header('Location: ../index.html?res=nologin');
            }
            break;
        case "getdata":
            if(isset($_REQUEST['id'])){
                $id = mysqli_real_escape_string($conn,$_REQUEST['id']);
                $query="SELECT * FROM `files` WHERE `Code`='$id'";
                $res = mysqli_query($conn,$query);
                $dat = mysqli_fetch_assoc($res);
                if($dat['ID']!=""){
                    if($dat['Public']==1){
                        echo FileData($id);
                    }else{
                        header('Location: ../index.html?res=filenotfound'); 
                    }
                }else{
                   header('Location: ../index.html?res=filenotfound'); 
                }
            }
            break;
        case "getdataprivate":
            if(isset($_REQUEST['id']) && CheckAuth()){
                session_start();
                $uid=$_SESSION['uid'];
                $id = mysqli_real_escape_string($conn,$_REQUEST['id']);
                $query="SELECT * FROM `files` WHERE `Code`='$id' AND `User` = $uid";
                $res = mysqli_query($conn,$query);
                $dat = mysqli_fetch_assoc($res);
                if($dat['ID']!=""){
                    echo FileData($id);
                }else{
                   header('Location: ../index.html?res=filenotfound'); 
                }
            }else{
                header('Location: ../index.html?res=filenotfound'); 
            }
            break;
        case "hide":
            if(CheckAuth()){
                if(isset($_REQUEST['id'])){
                    session_start();
                    $id = mysqli_real_escape_string($conn,$_REQUEST['id']);
                    $uid=$_SESSION['uid'];
                    $query="UPDATE `files` SET `Hidden` = 1 WHERE `User` = $uid AND Code = '$id' ;";
                    $res = mysqli_query($conn,$query);
                    header('Location: ../index.html?res=hidden&id='.$id);
                }
            }else{
                header('Location: ../index.html?res=nologin');
            }
            break;
        case "unhide":
            if(CheckAuth()){
                if(isset($_REQUEST['id'])){
                    session_start();
                    $id = mysqli_real_escape_string($conn,$_REQUEST['id']);
                    $uid=$_SESSION['uid'];
                    $query="UPDATE `files` SET `Hidden` = 0 WHERE `User` = $uid AND Code =  '$id' ;";
                    $res = mysqli_query($conn,$query);
                    header('Location: ../index.html?unhidden');
                }
            }else{
                header('Location: ../index.html?res=nologin');
            }
            break;
       case "account-size":
            if(CheckAuth()){
                session_start();
                $uid=$_SESSION['uid'];
                $query="SELECT SUM(`Size`) AS 'Size', COUNT(*) AS 'NOF' FROM `files` WHERE `User`= $uid";
                $res = mysqli_query($conn,$query);
                $dat = mysqli_fetch_assoc($res);
                if($dat['Size']!=""){
                    echo '{"result":[{"Size":"'.$dat['Size'] .'", "Unit":"Bytes", "NoF":"'.$dat['NOF'].'"}]}';
                }else{
                    echo '{"result":[{"Size":"0", "Unit":"Bytes", "NoF":"'.$dat['NOF'].'"}]}';
                }
            }else{
                header('Location: ../index.html?res=nologin');
            }
            break;
        case "sharemail":
            if(CheckAuth()){
                if(isset($_REQUEST['id']) && isset($_REQUEST['dest'])){
                    session_start();
                    $id = mysqli_real_escape_string($conn,$_REQUEST['id']);
                    $uid = $_SESSION['uid'];
                    $query="SELECT *, (SELECT `filedrop-users`.`mail` FROM `filedrop-users` WHERE `filedrop-users`.`ID` = $uid) AS 'Mail' FROM `files` WHERE `User`= $uid AND `Code`='$id' AND `Public` = 1";
                    $res = mysqli_query($conn,$query);
                    $dat = mysqli_fetch_assoc($res);
                    $fileIcon=Mimes(explode('.',$dat['Title'])[count(explode('.',$dat['Title']))-1]);
                    switch ($fileIcon){
                        case "img":
                            $fileIcon="picture-file.png";
                            break;
                        case "video":
                            $fileIcon="video-file.png";
                            break;
                        case "audio":
                            $fileIcon="audio-file.png";
                            break;
                        case "pdf":
                            $fileIcon="pdf-file.png";
                            break;
                        case "text":
                            $fileIcon="text-file.png";
                            break;
                        case "bin":
                                $fileIcon="bin-file.png";
                            break;
                    }
                    if($dat['Code']!=""){
                        if($dat['Public']==1){
                            $to = mysqli_real_escape_string($conn,$_REQUEST['dest']);
                            if(!filter_var($to, FILTER_VALIDATE_EMAIL) === false) {
                                $message='<!DOCTYPE html>
                                <html lang="en" xmlns="http://www.w3.org/1999/xhtml">
                                <head>
                                    <meta charset="utf-8">
                                </head>
                                <body style="margin:auto;text-align:center;">
                                    <center>
                                        <img src="'.$PROTO .$FQDN .'/img/band.png" width="520px">
                                        <table style="text-align:center;">
                                        <tbody>
                                            <tr>
                                                <th>
                                                    <br/>
                                                    <br/>
                                                    <img style="width:200px;" src="'.$PROTO .$FQDN .'/img/logo.png" width="160px">
                                                </th>
                                            </tr>
                                            <tr>
                                                <td>&nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <br/>
                                                    <br/>
                                                    <b>'.$dat['Mail'].'</b> Has Shared a File With You:
                                                </td>
                                            </tr>
                                            <tr>
                                            <td>
                                                <br/>
                                                <div style="cursor:pointer;">
                                                <a href="'.$PROTO .$FQDN .'/share.html?code='.$dat['Code'] .'" style="text-decoration:none;color: #0d6efd;">
                                                    <p>
                                                    <br/>
                                                    <img src="'.$PROTO .$FQDN .'/img/'.$fileIcon.'" height="60">
                                                    </p>
                                                    <p></p>
                                                    <p>'.substrwords($dat['Title'],20).'</p>
                                                    <p>'.number_format((intval($dat['Size']) / 1000000),2).' MB</p>
                                                    </a>
                                                </div>
                                            </td>
                                            </tr>
                                        </tbody>
                                        </table>
                                        <img src="'.$PROTO .$FQDN .'/img/bandbot.png" width="520px">
                                </center>
                                </body>
                                </html>';
                                $headers= 'From: ' .$SRVEMAIL .'' ."\r\n" ."Content-type: text/html \r\n";
                                $subject="FileDrop - File Shared"; 
                                $message=preg_replace("/(\s*[\r\n]+\s*|\s+)/", ' ', $message);
                                mail($to,$subject,$message,$headers);
                                echo 'ok';
                            }else{
                                echo 'fail';
                            }
                        }else{
                            header('Location: ../index.html'); 
                         }
                    }else{
                       header('Location: ../index.html'); 
                    }
                }
            }else{
                header('Location: ../index.html?res=nologin');
            }
            break;
}

function CheckAuth(){
    include("./incls.php");
    session_start();
    if($_SESSION['uid']!=""){
    $uid = $_SESSION['uid'];
    $query="SELECT * FROM `revoked-sessions` WHERE `User`= $uid ORDER BY `ID` DESC";
    $sql = mysqli_query($conn,$query);
    $row = mysqli_fetch_assoc($sql);
    if($row['ID']!=""){
        if((int)$_SESSION['login-time'] <= (int)$row['BeforeTime']){
            $_SESSION['uid']="";
            session_destroy();
            header('Location: ../index.html');
        }else{
            return true;
        }
    }else{
        return true;
    }
    }else{
        return false;
    }
}
function FilesData($uid){
    include("./incls.php");
    $source .= "{\"result\":[";
    $query="SELECT * FROM `files` WHERE `User`= $uid";
    $sql = mysqli_query($conn,$query);
            while($row = mysqli_fetch_assoc($sql)){
                if($source!='{"result":['){
                    $source.=",";
                }
                $source .= "{";
                $source .= "\"ID\":";
                $source .= json_encode($row['ID']);
                $source .= ",";
                $source .= "\"Name\":";
                $source .= json_encode($row['Name']);
                $source .= ",";
                $source .= "\"Code\":";
                $source .= json_encode($row['Code']);
                $source .= ",";
                $source .= "\"Title\":";
                $source .= json_encode($row['Title']);
                $source .= ",";
                $source .= "\"Size\":";
                $source .= json_encode($row['Size']);
                $source .= ",";
                $source .= "\"Public\":";
                $source .= json_encode($row['Public']);
                $source .= ",";
                $source .= "\"Hidden\":";
                $source .= json_encode($row['Hidden']);
                $source .= "}";
            }
        $source .="]}";
        return $source;
}
function LoginsData($uid){
    include("./incls.php");
    $source .= "{\"result\":[";
    $query="SELECT * FROM `access-logs` WHERE `User`= $uid ORDER BY `ID` DESC LIMIT 5";
    $sql = mysqli_query($conn,$query);
            while($row = mysqli_fetch_assoc($sql)){
                if($source!='{"result":['){
                    $source.=",";
                }
                $source .= "{";
                $source .= "\"ID\":";
                $source .= json_encode($row['ID']);
                $source .= ",";
                $source .= "\"User\":";
                $source .= json_encode($row['User']);
                $source .= ",";
                $source .= "\"IP\":";
                $source .= json_encode($row['IP']);
                $source .= ",";
                $source .= "\"Location\":";
                $source .= json_encode($row['Location']);
                $source .= ",";
                $source .= "\"UserAgent\":";
                $source .= json_encode($row['UserAgent']);
                $source .= ",";
                $source .= "\"Time\":";
                $source .= json_encode($row['Time']);
                $source .= "}";
            }
        $source .="]}";
        return $source;
}
function FileData($id){
    include("./incls.php");
    $source .= "{\"result\":[";
    $query="SELECT * FROM `files` WHERE `Code`= $id";
    $sql = mysqli_query($conn,$query);
            while($row = mysqli_fetch_assoc($sql)){
                if($source!='{"result":['){
                    $source.=",";
                }
                $source .= "{";
                $source .= "\"ID\":";
                $source .= json_encode($row['ID']);
                $source .= ",";
                $source .= "\"Name\":";
                $source .= json_encode($row['Name']);
                $source .= ",";
                $source .= "\"Code\":";
                $source .= json_encode($row['Code']);
                $source .= ",";
                $source .= "\"Title\":";
                $source .= json_encode($row['Title']);
                $source .= ",";
                $source .= "\"Size\":";
                $source .= json_encode($row['Size']);
                $source .= ",";
                $source .= "\"Public\":";
                $source .= json_encode($row['Public']);
                $source .= ",";
                $source .= "\"Hidden\":";
                $source .= json_encode($row['Hidden']);
                $source .= "}";
            }
        $source .="]}";
        return $source;
}
function substrwords($text, $maxchar, $end='...') {
    if (strlen($text) > $maxchar || $text == '') {
        $words = preg_split('/\s/', $text);      
        $output = '';
        $i      = 0;
        while (1) {
            $length = strlen($output)+strlen($words[$i]);
            if ($length > $maxchar) {
                break;
            } 
            else {
                $output .= " " . $words[$i];
                ++$i;
            }
        }
        $output .= $end;
    } 
    else {
        $output = $text;
    }
    return $output;
}
function Mimes($ext){
    switch(strtoupper($ext)){
        default:
            $ret="bin";
            //MIME Not Found

            break;

        //Pictures

        case "PNG":
            $ret="img";
            break;
        case "JPG":
            $ret="img";
            break;
        case "JPEG":
            $ret="img";
            break;
        case "BMP":
            $ret="img";
            break;
        case "FIF":
            $ret="img";
            break;
        case "GIF":
            $ret="img";
            break;
        case "ICO":
            $ret="img";
            break;
        case "ICO":
            $ret="img";
            break;
        case "JFIF":
            $ret="img";
            break;
        case "JPE":
            $ret="img";
            break;
        case "TIF":
            $ret="img";
            break;
        case "TIFF":
            $ret="img";
            break;
        case "WEBP":
            $ret="img";
            break;
        
        //Videos

        case "AVI":
            $ret="video";
            break;
        case "M1V":
            $ret="video";
            break;
        case "MOV":
            $ret="video";
            break;
        case "MOOV":
            $ret="video";
            break;
        case "MP2":
            $ret="video";
            break;
        case "MPEG":
            $ret="video";
            break;
        case "MP4":
            $ret="video";
            break;

        //Audio

        case "AIF":
            $ret="audio";
            break;
        case "AIFC":
            $ret="audio";
            break;
        case "AIFF":
            $ret="audio";
            break;
        case "M2A":
            $ret="audio";
            break;
        case "M4A":
            $ret="audio";
            break;
        case "M3U":
            $ret="audio";
            break;
        case "MID":
            $ret="audio";
            break;
        case "MIDI":
            $ret="audio";
            break;
        case "MP2":
            $ret="audio";
            break;
        case "MP3":
            $ret="audio";
            break;
        case "MPA":
            $ret="audio";
            break;
        case "WAV":
            $ret="audio";
            break;
        case "WMA":
            $ret="audio";
            break;
        case "WAVE":
            $ret="audio";
            break;

        //Text

        case "TXT":
            $ret="text";
            break;
        
        //PDF

        case "PDF":
            $ret="pdf";
            break;
    }
    return $ret;
}
?>