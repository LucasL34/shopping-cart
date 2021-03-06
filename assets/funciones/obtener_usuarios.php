<?php
header('Content-Type: application/json');
require_once("./database.php");

$resultado = null;
$parametros = null;

function fetchDB( $cadena, $mysqli){ 

    $arr = []; // save data & return

    if($resultado = $mysqli->query($cadena)){

        if($resultado->num_rows > 0){
            while ($fila = $resultado->fetch_assoc()) {
                $arr[] = $fila;
            }

            $respuesta = [ "status"=> 200, "response"=>$arr ];
        }
        else{
            $respuesta = [ "status"=> 200, "response"=> [] ];
        }
    }else{
        $respuesta = [ "status"=> 404, "response"=> "error" ];
    }

    return $respuesta;

}

if($_SERVER['REQUEST_METHOD'] == "GET") {
    $parametros = $_GET;

    if( isset($_GET['q']) && $_GET['q'] == true ) {

        if( isset($_GET['byid']) ) {

            $id = $_GET['byid'];
            $sql = "SELECT * FROM usuario WHERE prod_id=$id";

            echo json_encode( fetchDB($sql, $mysqli) );
        }

        if( isset($_GET['user_f']) &&  $_GET['user_f'] == 'name' ){
            $name = $_GET['name'];
            $sql = "SELECT * FROM usuario WHERE user_username='$name'";
            
            echo json_encode( fetchDB($sql, $mysqli) );
        }
        if ( isset($_GET['designers']) && $_GET['designers'] == true ) { // get designers data
                $id_first = $_GET['id1'];
                $id_second = $_GET['id2'];
                $id_third = $_GET['id3'];
                /* verification 
                echo $id_first . " - ";
                echo $id_second . " - ";
                echo $id_third . "  ";*/
            
            $sql = "SELECT * FROM designers WHERE des_id = $id_first OR des_id = $id_second OR des_id = $id_third"; // multiple selection by id

            

            echo json_encode( fetchDB($sql, $mysqli) );
        }
    }else{
        $sql = "SELECT * FROM usuario ORDER BY user_id";

        echo json_encode( fetchDB($sql, $mysqli) );
    }

}

if($_SERVER['REQUEST_METHOD'] == "POST"){
    if(isset($_SERVER['CONTENT_TYPE']) && $_SERVER['CONTENT_TYPE'] == 'application/json') {
        $requestDataJSON = file_get_contents('php://input');
        $parametros = json_decode($requestDataJSON, TRUE);
    }else{
        $parametros = $_POST;
    }

    // user_nombre	user_username	user_pass	prods_carrito
    
    if ( isset($parametros['nombre_completo']) && isset($parametros['username_r']) && isset($parametros['pass_r']) && isset($parametros['carrito']) ){
        
        $insert = sprintf("INSERT INTO usuario (user_nombre, user_username, user_pass, prods_carrito) VALUES ( '%s', '%s', '%s', '%s' )",
            $parametros['nombre_completo'], 
            $parametros['username_r'], 
            $parametros['pass_r'], 
            $parametros['carrito']
        );

        if( $mysqli->query($insert) === TRUE ){
            $respuesta = [
                "status" => 201, "response"=> [ 
                    "id" => $mysqli->insert_id, 
                    "nombre" => $parametros['nombre_completo'], 
                    "username"=>$parametros['username_r'], 
                    "contraseña" => $parametros['pass_r'],
                    "contraseña" => $parametros['carrito']
            ]
        ];

            echo json_encode($respuesta);
        }else{
            $respuesta = ["status"=> 500, "response"=> "error"];

            echo json_encode($respuesta);
        }

    }else{
        $respuesta = [ "status"=> 401, "response" => 'no, verificar formulario' ];

        echo json_encode($respuesta); 
    }
}

if($_SERVER['REQUEST_METHOD'] == "PUT"){
    if(isset($_SERVER['CONTENT_TYPE']) && $_SERVER['CONTENT_TYPE'] == 'application/json') {
        $requestDataJSON = file_get_contents('php://input');
        $parametros = json_decode($requestDataJSON, TRUE);
    }else{
        $parametros = $_POST;
    }

    // user_nombre	user_username	user_pass	prods_carrito

    if( isset($parametros['user_id']) && isset($parametros['user_nombre']) && 
        isset($parametros['user_username']) && isset($parametros['user_pass']) && 
        isset($parametros['user_carrito']) ){

        $update = sprintf("UPDATE usuario SET user_nombre='%s', user_username ='%s', user_pass = '%s', prods_carrito = '%s' WHERE user_id = '%s' ", 
        $parametros['user_nombre'], $parametros['user_username'], 
        $parametros['user_pass'], $parametros['user_carrito'], 
        $parametros['user_id']);

        if($mysqli->query($update) === TRUE){
                $respuesta = [
                    "status" => 201, "response"=> [ "id" => $parametros['user_id'], 
                    "nombre: " => $parametros['user_nombre'], "username"=>$parametros['user_username'], 
                    "Carrito: " => $parametros['user_carrito'], "contraseña: " => $parametros['user_pass'],
                    ]
                ];

            echo json_encode($respuesta);
    }else{
        $respuesta = ["status"=> 400, "response"=> "Error" ];

        echo json_encode($respuesta);
    }
    
    }else{
        $respuesta = ["status"=> 500, "response"=> "Verificar formulario (?)"];

        echo json_encode($respuesta);
    }
    
}
?>