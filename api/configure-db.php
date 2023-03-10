<?php

/*MYSql Server IP/FQDN*/ $dbServername = "localhost";
    /*MYSql Username      */ $dbUsername = "root";
    /*MYSql Password      */ $dbPassword ="";
    /*MYSql Database Name */ $dbName = "filedrop";

error_reporting(E_ERROR | E_PARSE);
if(!isset($_REQUEST['action'])){
    echo '
    <!DOCTYPE html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <link rel="icon" href="../favicon.ico">
        <title>FileDrop Configuration Page</title>
        <meta charset="utf-8">
    </head>
    <body style="margin:auto;text-align:center;font-family:Helvetica;">
        <center>
            <br/>
            <br/>
            <br/>
            <img src="../img/band.png" width="520px">
            <table style="text-align:center;">
            <tbody>
                <tr>
                    <th>
                        <br/>
                        <br/>
                        <img style="width:200px;" src="../img/logo.png" width="160px">
                    </th>
                </tr>
                <tr>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td>
                        FileDrop Configuration Page
                    </td>
                </tr>
                <tr>
                <br/>
                <br/>
                <td>
                    <form method="POST" action="./configure-db.php">
                        <input type="hidden" name="action" value="setup">
                        <br/>
                        <label for="email">First User Email</label>
                        <br/>
                        <input type="email" name="email" placeholder="First User Email" />
                        <br/>
                        <br/>
                        <label for="email">First User Password</label>
                        <br/>
                        <input type="password" name="password" placeholder="First User Password" />
                        <br/>
                        <br/>
                        <button type="submit">Configure</button>
                        <br/>
                        <br/>
                    </form>
                </td>
                </tr>
            </tbody>
            </table>
            <img src="../img/bandbot.png" width="520px">
    </center>
    </body>
    </html>';
}else{
    $conn = mysqli_connect($dbServername, $dbUsername, $dbPassword);
    $query='
        CREATE DATABASE IF NOT EXISTS `filedrop`;
        CREATE TABLE `filedrop`.`access-logs`(
            `ID` int NOT NULL,
            `User` int NOT NULL,
            `IP` text NOT NULL,
            `Location` text NOT NULL,
            `UserAgent` text NOT NULL,
            `Time` text NOT NULL
        );
        CREATE TABLE `filedrop`.`filedrop-users`(
            `ID` int NOT NULL,
            `mail` text NOT NULL,
            `hash` text NOT NULL
        );
        INSERT INTO `filedrop`.`filedrop-users` (`mail`,`hash`) VALUES(\''.mysqli_real_escape_string($conn,$_REQUEST['email']) .'\', \'' .password_hash($_REQUEST['password'], PASSWORD_DEFAULT) .'\');
        CREATE TABLE `filedrop`.`files`(
            `ID` int NOT NULL,
            `User` int NOT NULL,
            `Code` text NOT NULL,
            `Name` text NOT NULL,
            `Title` text NOT NULL,
            `Size` text NOT NULL,
            `Public` tinyint(1) NOT NULL DEFAULT \'0\',
            `Hidden` tinyint(1) NOT NULL DEFAULT \'0\'
        );
        CREATE TABLE `filedrop`.`revoked-sessions`(
            `ID` int NOT NULL,
            `User` int NOT NULL,
            `BeforeTime` text NOT NULL
        );
        ALTER TABLE `filedrop`.`access-logs` ADD PRIMARY KEY (`ID`);
        ALTER TABLE `filedrop`.`filedrop-users` ADD PRIMARY KEY (`ID`);
        ALTER TABLE `filedrop`.`files` ADD PRIMARY KEY (`ID`);
        ALTER TABLE `filedrop`.`revoked-sessions` ADD PRIMARY KEY (`ID`);
        ALTER TABLE `filedrop`.`access-logs` MODIFY `ID` int NOT NULL AUTO_INCREMENT;
        ALTER TABLE `filedrop`.`filedrop-users` MODIFY `ID` int NOT NULL AUTO_INCREMENT;
        ALTER TABLE `filedrop`.`files` MODIFY `ID` int NOT NULL AUTO_INCREMENT;
        ALTER TABLE `filedrop`.`revoked-sessions` MODIFY `ID` int NOT NULL AUTO_INCREMENT;
    ';
    mysqli_multi_query($conn, $query);
    unlink("./configure-db.php");
    header("Location:../index.html");
}
?>