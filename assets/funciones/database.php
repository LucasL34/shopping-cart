<?php 
    $mysqli = new mysqli("localhost", "root", "", "tofudb"); // test
    // $mysqli = new mysqli("localhost", "id14281637_tofudb", "UYtorIjl0h=EtjdE", "id14281637_admin"); //host

    $mysqli->set_charset("utf8");

    if($mysqli->connect_errno){
        echo "Fallo".$mysqli->connect_error;
    }

?>