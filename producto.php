<?php 
    session_start(); 
    if(!isset($_GET['prod_id'])){
        echo '<script> location.href = "./index.php"; </script>';
    }
    // set prod_id when into page 
    echo "<script>
            localStorage.setItem('prod_id', ".$_GET['prod_id']."); 
        </script>";

?>
<!DOCTYPE html>
<html lang="es">
<head>
    
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title> Cargando... </title>

    <link rel="apple-touch-icon" sizes="57x57" href="./assets/img/favicon/apple-icon-57x57.png">
    <link rel="apple-touch-icon" sizes="60x60" href="./assets/img/favicon/apple-icon-60x60.png">
    <link rel="apple-touch-icon" sizes="72x72" href="./assets/img/favicon/apple-icon-72x72.png">
    <link rel="apple-touch-icon" sizes="76x76" href="./assets/img/favicon/apple-icon-76x76.png">
    <link rel="apple-touch-icon" sizes="114x114" href="./assets/img/favicon/apple-icon-114x114.png">
    <link rel="apple-touch-icon" sizes="120x120" href="./assets/img/favicon/apple-icon-120x120.png">
    <link rel="apple-touch-icon" sizes="144x144" href="./assets/img/favicon/apple-icon-144x144.png">
    <link rel="apple-touch-icon" sizes="152x152" href="./assets/img/favicon/apple-icon-152x152.png">
    <link rel="apple-touch-icon" sizes="180x180" href="./assets/img/favicon/apple-icon-180x180.png">
    <link rel="icon" type="image/png" sizes="192x192" href="./assets/img/favicon/android-icon-192x192.png">
    <link rel="icon" type="image/png" sizes="32x32" href="./assets/img/favicon/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="96x96" href="./assets/img/favicon/favicon-96x96.png">
    <link rel="icon" type="image/png" sizes="16x16" href="./assets/img/favicon/favicon-16x16.png">
    <link rel="manifest" href="/manifest.json">
    <meta name="msapplication-TileColor" content="#ffffff">
    <meta name="msapplication-TileImage" content="/ms-icon-144x144.png">
    <meta name="theme-color" content="#ffffff">
    
    <link rel="stylesheet" href="./assets/css/main.css">
    <link rel="stylesheet" href="./assets/css/font.css">
    
</head>
<body>
    <nav class="nav">
        <a href="./index.php#top" id="logoVinculo">
            <img src="./assets/img/logo.png" alt="Logo de Toru" class="logo" id="logoShop">
        </a>
        <div class="control"><?php
            if(isset($_SESSION['login'])){
                session_on($_SESSION['username']);
            }else{
                session_off();
            }
        ?></div>
    </nav>

    <div id="carritoUI" data-cart="hidden"></div>

    <div id="producto_main">
        <div id="blue">
            <img id="prod_img_">
        </div>
        <div id="red">
            <h2 id="prod_titulo"></h2>
            <p id="prod_descr_"></p>
            <div id="prod_info_">
                <span id="prod_review_"></span>
                <span id="prod_empresa_"></span>
                <span id="prod_stock"></span>
                <span id="prod_precio_"></span>
            </div>
            <hr class="separador">
            <div id="prod_button">
                <input type="submit" class="button" id="prod-buy" data-buy="no_buy" value="Comprar" onclick="buy(<?php echo $_GET['prod_id'] ?>)">
                <input type="submit" class="button" id="prod-cart_add" data-add="no_add" value="Añadir al carrito" onclick="addCarrito(<?php echo $_GET['prod_id'] ?>, '<?php echo $_SESSION['username'] ?>')">
            </div>
        </div>
    </div>

    <footer class="footer" id="footerShop">
        <div class="footerSection" id="nosotros">
            <a href="#top"> Toru Store</a>
            <hr class="separador">
            <img src="./assets/img/store.svg" alt="Logo Toru" id="footerLogo">
        </div>

        <div class="footerSection" id="inicio">
            <h4> Inicio </h4>
            <hr class="separador">
            <a href="./index.html#top"> Videojuegos MERCH </a>
            <a href="./index.html#ofertas"> Empresarios </a>
            <a href="./index.html#productos"> Productos </a>
        </div>

        <div class="footerSection" id="contacto">
            <h4> Contactos</h4>
            <hr class="separador">
            <span> (+54) 911 9999 9999 </span>
            <span> contacto@toru.com.ar </span>
            <span> Estatista Alberdi 98 piso 3 </span>
        </div>
        
        <div class="creditos">
            <i> toru 2020 </i>
            <i> Términos y condiciones </i>
        
            <div id="footerRedes">
                <span class="icon-facebook"></span>
                <span class="icon-pinterest"></span>
                <span class="icon-instagram"></span>
                <span class="icon-twitter"></span>
            </div>
        </div>
    </footer>

    <script src="./assets/js/fetch_data.js"></script>
    <script src="./assets/js/main.js"></script>
    <script src="./assets/js/cart.js"></script>
    <script src="./assets/js/load_product.js"></script>
</body>
</html>
<?php

    function session_on($name){ //with login
        echo '<img src="./assets/img/store.svg" alt="Icono de carrito" id="carrito" onclick="MostrarCarrito()">';
        echo '<span id="username_p">!Hola, <b>'.$name.'</b>!</span>';
        echo '<span class="icon-download3" onclick="cerrarSesion()">';
    }

    function session_off(){ //without login
        echo '<a class="navLink" href="./register.php"> Registrarse </a>';
        echo '<a class="navLink" href="./login.php"> Iniciar sesión </a>';
    }

?>