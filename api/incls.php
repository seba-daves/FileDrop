<?php
    //CONFIGURE THIS PART
    
    /*MYSql Server IP/FQDN*/ $dbServername = "localhost";
    /*MYSql Username      */ $dbUsername = "root";
    /*MYSql Password      */ $dbPassword ="";
    /*MYSql Database Name */ $dbName = "filedrop";



    //DO NOT TOUCH
    $conn = mysqli_connect($dbServername, $dbUsername, $dbPassword, $dbName);
?>