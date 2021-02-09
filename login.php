<?php 
    session_start(); 
    require("./assets/funciones/database.php");
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title> Toru | Login </title>

    <link rel="apple-touch-icon" sizes="57x57" href="./assets/img/favicon/apple-icon-57x57.png">
    <link rel="apple-touch-icon" sizes="60x60" href="./assets/img/favicon/apple-icon-60x60.png">
    <link rel="apple-touch-icon" sizes="72x72" href="./assets/img/favicon/apple-icon-72x72.png">
    <link rel="apple-touch-icon" sizes="76x76" href="./assets/img/favicon/apple-icon-76x76.png">
    <link rel="apple-touch-icon" sizes="114x114" href="./assets/img/favicon/apple-icon-114x114.png">
    <link rel="apple-touch-icon" sizes="120x120" href="./assets/img/favicon/apple-icon-120x120.png">
    <link rel="apple-touch-icon" sizes="144x144" href="./assets/img/favicon/apple-icon-144x144.png">
    <link rel="apple-touch-icon" sizes="152x152" href="./assets/img/favicon/apple-icon-152x152.png">
    <link rel="apple-touch-icon" sizes="180x180" href="./assets/img/favicon/apple-icon-180x180.png">
    <link rel="icon" type="image/png" sizes="192x192"  href="./assets/img/favicon/android-icon-192x192.png">
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
    <div class="content" id="login"></div>
        <nav class="nav">
            <a href="./index.php" id="logoVinculo">
                <img src="./assets/img/logo.png" alt="Logo de Toru" class="logo" id="logoShop">
            </a>
            <a class="navLink" href="./register.php"> Unirse </a>
        </nav>
        <header class="header">
            <h2 class="bienvenide" id="bien_i">Bienvenid@</h2>
            <p class="parrafo" id="parrafo_i"> compra todo lo que necesites para tu casa, departamento u oficina.</p>
        </header>
        <form action="#" method="POST" class="loginForm">
            <fieldset class="fieldset">
                <label for="username"> USERNAME: <span class="color-red">*</span></label>

                <div class="inputContainer">
                    <input type="text" id="username" class="inputs" required autocomplete="off" name="username_l">
                </div>
            
                <label for="password">PASSWORD: <span class="color-red">*</span> </label>

                <div class="inputContainer">
                    <span class="icon-key2" onclick="olvido()"></span>
                    <span class="icon-eye" onclick="mostrarContrasenia(this)"></span>
                    <input type="password" class="inputs pass" id="pass" required autocomplete="off" name="pass_l">
                </div>
                <p class="color-red warning opacity_0" id="error"></p>
            </fieldset>
            
            <input type="submit" value="Ingresar uwu" name="submit_l">
        </form>
        <p class="decoracion"> Si no tienes cuenta, registrate haciendo <a class="vinculo" href="./register.html"> click aquí </a>.</p>
    
    <footer class="footer footerSesion">
        <i> toru 2020 </i>
        <div id="footerRedes">
            <span class="icon-facebook"></span>
            <span class="icon-pinterest"></span>
            <span class="icon-instagram"></span>
            <span class="icon-twitter"></span>
        </div>
    </footer>

    <script src="./assets/js/password.js"></script>
    <script src="./assets/js/main.js"></script>
    <?php if (isset($_POST['submit_l'])) {
            if ( isset($_POST['username_l']) && isset($_POST['pass_l']) ) {

                $username = $_POST['username_l'];
                $pass = $_POST['pass_l'];

                $pass = md5($pass);

                $sql = "SELECT * FROM usuario WHERE user_username = '$username' AND user_pass = '$pass'";
                
                if ( $resultado = $mysqli->query($sql) ){
                    if($resultado->num_rows > 0){

                        $values = $resultado->fetch_assoc(); 

                        $_SESSION['login'] = true; // verified login
                        $_SESSION['username'] = $username; 
                        
                        echo '<script>
                                localStorage.setItem("user_id", '.$values['user_id'].');
                                location.href = "./index.php";
                            </script>';
                            // save id user and redirection
                            
                    }else{
                        echo '<script> error(1) </script>'; 
                        // Unregistered user
                    }
                }
            }
        } ?>
</body>
</html>