<?php session_start(); ?>
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
    <a name="top"></a>
    
    <nav class="nav">
        <a href="#top" id="logo_vinculo">
            <img src="./assets/img/logo.png" alt="Logo de Toru" class="logo" id="logo_shop">
        </a>
        <div class="control" id="control_index"><?php
            if(isset($_SESSION['login'])){
                session_on($_SESSION['username']);
            }else{
                session_off();
            }
        ?></div>
    </nav>

    <div id="filtrar_div">
        <form action="./filtrar.php" method="POST" id="form_s">
            <select id="calificacion" class="select" name="review_f">
                <option value="99" disabled selected hidden> Calificación </option>
                <option value="0"> Muy bueno </option>
                <option value="1"> Bueno </option>
                <option value="2"> Regular </option>
                <option value="3"> Malo </option>
                <option value="4"> Muy malo </option>
            </select>

            <select id="precio" class="select" name="precio_f">
                <option value="999999" disabled selected hidden> Precio </option>
                <option value="2000"> Menos de $2.000 </option>
                    <option value="5500"> Menos de $5.500 </option>
                    <option value="10000"> Menos de $10.000 </option>
                    <option value="100000"> Menos de $100.000 </option>
            </select>

            <input type="submit" name="filtrar" value="Filtrar" id="filtrar_button">
        </form>
    </div>
    
    <div id="carrito_ui" data-cart="hidden"></div>

    <section class="content" id="index">
        <div class="collection_div" id="toys">
            <h2> Videogames MERCH </h2>
            <hr class="separador">
            <div class="collection" id="toys_prod"></div>
        </div>

        <a name="business"></a>
        <div class="collection_div" id="business">
            <h2> CORTE EMPRESAURIO </h2>
            <hr class="separador">
            <div class="collection" id="business_prod"></div>
        </div>
        <a name="productos"></a>
        <div id="productos"></div>

        <div id="designers">
            <h2> Top Designers </h2>
            <hr class="separador">
            <div id="designers_prod"></div>
        </div>
    </section>

    <footer class="footer" id="footer_shop">
        <div class="footerSection" id="nosotros">
            <a href="#top"> Toru Store</a>
            <hr class="separador">
            <img src="./assets/img/store.svg" alt="Logo Toru" id="footer_logo">
        </div>

        <div class="footerSection" id="inicio">
            <h4> Inicio </h4>
            <hr class="separador">
            <a href="#top"> Videojuegos MERCH </a>
            <a href="#business"> Empresarios </a>
            <a href="#productos"> Productos </a>
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
        
            <div id="footer_redes">
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
    <script src="./assets/js/save_filter.js"></script>
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