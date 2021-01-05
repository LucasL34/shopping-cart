<?php 
    $mysqli = new mysqli("localhost", "root", "", "tofuDB");
    // $mysqli = new mysqli("localhost", "id14281637_tofudb", "UYtorIjl0h=EtjdE", "id14281637_admin");

    $mysqli->set_charset("utf8");

    if($mysqli->connect_errno){
        echo "Fallo".$mysqli->connect_error;
    }

?>