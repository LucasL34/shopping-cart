<?php
header('Content-type: application/json');
require("./database.php");

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
    // filtrar por id, precio, tag
    if(isset($_GET['q']) && $_GET['q'] == true ){ // validate query request
        if( isset($_GET['prod_f']) && $_GET['prod_f'] == "business"){

            $sql = "SELECT * FROM producto WHERE tag = 'business' ORDER BY prod_id ASC";

            echo json_encode( fetchDB($sql, $mysqli) );

        }
        if( isset($_GET['prod_f']) && $_GET['prod_f'] == "teddies"){
            
            $sql = "SELECT * FROM producto WHERE tag = 'teddies' ORDER BY prod_id ASC";

            echo json_encode( fetchDB($sql, $mysqli) );

        }
        if( isset($_GET['prod_f']) && ($_GET['prod_f'] == "other" || $_GET['prod_f'] == "others") ) { // all - buss & toys 

            $sql = "SELECT * FROM producto WHERE NOT tag = 'business' AND NOT tag = 'teddies' ORDER BY prod_id ASC ";

            echo json_encode( fetchDB($sql, $mysqli) );

        }

        else{
            echo "Filter error";
        }
    }else{
        $sql = "SELECT * FROM producto ORDER BY prod_id ASC";
        
        echo json_encode( fetchDB($sql, $mysqli) );

    }
}


if($_SERVER['REQUEST_METHOD'] == "PUT"){
    if(isset($_SERVER['CONTENT_TYPE']) && $_SERVER['CONTENT_TYPE'] == 'application/json') {
        $requestDataJSON = file_get_contents('php://input');
        $parametros = json_decode($requestDataJSON, TRUE);
    }else{
        $parametros = $_POST;
    }

    // prod_id prod_nombre prod_precio prod_image prod_review prod_descr prod_cant prod_empresa

    if( isset($parametros['prod_id']) && isset($parametros['prod_nombre']) && 
        isset($parametros['prod_precio']) && isset($parametros['prod_image']) && 
        isset($parametros['prod_review']) && isset($parametros['prod_descr']) && 
        isset($parametros['prod_cant']) && isset($parametros['prod_empresa'])  ){

        $update = sprintf("UPDATE producto SET prod_nombre='%s', prod_precio ='%s', prod_image = '%s', prod_review = '%s', prod_descr = '%s', prod_cant = '%s', prod_empresa= '%s' WHERE prod_id = '%s' ", 
        $parametros['prod_nombre'], 
        $parametros['prod_precio'], 
        $parametros['prod_image'], 
        $parametros['prod_review'], 
        $parametros['prod_descr'], 
        $parametros['prod_cant'],
        $parametros['prod_empresa'], 
        $parametros['prod_id']);

        if($mysqli->query($update) === TRUE){
                $respuesta = [
                    "status" => 201, "response"=> [ "Id: " => $parametros['prod_id'], 
                    "Nombre: " => $parametros['prod_nombre'], "Precio: "=>$parametros['prod_precio'], 
                    "Imagen_url: " => $parametros['prod_image'], "Review_cod: " => $parametros['prod_review'],
                    "Descripcion: " => $parametros['prod_descr'], "Cant: " => $parametros['prod_cant'],
                    "Empresa: " => $parametros['prod_empresa']
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