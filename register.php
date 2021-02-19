<?php session_start(); 
    require("./assets/funciones/database.php");
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title> Toru | register </title>

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

    <link rel="stylesheet" href="assets/css/main.css">
    <link rel="stylesheet" href="./assets/css/font.css">
</head>
<body>
    <div class="content" id="register"></div>
    <nav class="nav">
        <a href="./index.php" id="logo_vinculo">
            <img src="./assets/img/logo.png" alt="Logo de Toru" class="logo" id="logo_shop">
        </a>
        <a class="navLink" href="./login.php"> Entrar </a>
    </nav>
    <header class="header">
        <h2 class="bienvenide" id="bien_r">Bienvenid@</h2>
        <p class="parrafo" id="parrafo_r"> ingrensa y descubre todos los productos que puedes imaginar</p>
    </header>    
    <form action="#" method="POST" class="loginForm" id="form_r">
        <fieldset class="fieldset" id="fieldset_r">
                <label for="name_r"> Nombre completo: </label>
            <div class="inputContainer">
                <input type="text" class="inputs" id="nombre_completo" name="name_r">
            </div>
                <label for="username_r"> Nombre de usuario: <span class="color-red">*</span> </label>
            <div class="inputContainer">
                <input type="text" class="inputs" id="username_r" name="username_r">
            </div>
                <label for="pass_r"> Contraseña: <span class="color-red">*</span> </label>
            <div class="inputContainer">
                <span class="icon-eye" id="ojete" onclick="mostrarContrasenia(this)"></span>
                <input type="password" class="inputs pass" id="pass" name="pass_r">
            </div>
                <label for="pass_r_confirmar"> Confirmar contraseña: <span class="color-red">*</span> </label>
            <div class="inputContainer">
                <span class="icon-eye" onclick="mostrarContrasenia(this)"></span>
                <input type="password" class="inputs pass" id="pass_confirmar" name="pass2_r">
            </div>
            <p class="color-red warning opacity_0" id="error">  </p>
        </fieldset>
        <input type="submit" value="¡Estoy listo!" id="registro__" name="submit_r">
    </form>

    <p class="decoracion" id="decoracion_r"> Si ya tienes cuenta, ingresa con el siguiente <a class="vinculo" id="vinculo_r" href="./register.html"> enlace </a>.</p>

    <footer class="footer footerSesion">
        <i> toru 2020 </i>
        <div id="footer_redes">
            <span class="icon-facebook"></span>
            <span class="icon-pinterest"></span>
            <span class="icon-instagram"></span>
            <span class="icon-twitter"></span>
        </div>
    </footer>

    <script src="./assets/js/password.js"></script>
    <script src="./assets/js/main.js"></script>
    <?php 
    if (isset($_POST['submit_r'])) {
        if(
            isset($_POST['name_r']) && isset($_POST['username_r']) &&
            isset($_POST['pass_r']) && isset($_POST['pass2_r'])
        ){

            $name = $_POST['name_r'];
            $username = $_POST['username_r'];
            $pass = $_POST['pass_r'];
            $pass_confirm = $_POST['pass2_r'];

            if($pass == $pass_confirm){

                $verificado = 0;
                $pass = md5($pass); // scripting pass 

                $sql = "INSERT INTO usuario (user_nombre, user_username, user_pass, prods_carrito) VALUES ('$name', '$username', '$pass', 0)";
                
                    $select = "SELECT * FROM usuario WHERE user_username = '$username'";

                    if ( $registro = $mysqli->query($select) ) {
                        if ( $registro->num_rows > 0 ) {
                            $verificado = 1; //username existing 
                        }
                    }

                if ($verificado == 1) {
                    echo '<script> error(2); </script>'; // invalid username 
                }

                if( $verificado == 0 && $mysqli->query($sql) == true ){

                    $_SESSION['login'] = true;
                    $_SESSION['username'] = $username;

                }
            }else{
                echo '<script> error(0); </script>'; // password 
            }
        }else{
            echo '<script> console.log("Comprobar form"); </script>';
        }
    }
    ?>
</body>
</html>