<?php
header('Content-Type: application/json');
require_once("./database.php");

$resultado = null;
$parametros = null;


if($_SERVER['REQUEST_METHOD'] == "GET") {
    $data = [];
    $parametros = $_GET;

    $sql = "SELECT * FROM usuario ORDER BY user_id ASC";
    $resultado = $mysqli->query($sql);

    if($resultado->num_rows > 0){
        while($fila = $resultado->fetch_assoc()){
            $data[] = $fila;
        }

        $respuesta = [ "status"=> 200, "response"=>$data];

        echo json_encode($respuesta);
    }else{
        $respuesta = [ "status"=> 200, "response"=> [] ];

        echo json_encode($respuesta);
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