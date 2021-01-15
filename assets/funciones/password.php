<?php
    require("./database.php");
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title> Toru | Recuperar password </title>

    <link rel="apple-touch-icon" sizes="57x57" href="../img/favicon/apple-icon-57x57.png">
    <link rel="apple-touch-icon" sizes="60x60" href="../img/favicon/apple-icon-60x60.png">
    <link rel="apple-touch-icon" sizes="72x72" href="../img/favicon/apple-icon-72x72.png">
    <link rel="apple-touch-icon" sizes="76x76" href="../img/favicon/apple-icon-76x76.png">
    <link rel="apple-touch-icon" sizes="114x114" href="../img/favicon/apple-icon-114x114.png">
    <link rel="apple-touch-icon" sizes="120x120" href="../img/favicon/apple-icon-120x120.png">
    <link rel="apple-touch-icon" sizes="144x144" href="../img/favicon/apple-icon-144x144.png">
    <link rel="apple-touch-icon" sizes="152x152" href="../img/favicon/apple-icon-152x152.png">
    <link rel="apple-touch-icon" sizes="180x180" href="../img/favicon/apple-icon-180x180.png">
    <link rel="icon" type="image/png" sizes="192x192"  href="../img/favicon/android-icon-192x192.png">
    <link rel="icon" type="image/png" sizes="32x32" href="../img/favicon/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="96x96" href="../img/favicon/favicon-96x96.png">
    <link rel="icon" type="image/png" sizes="16x16" href="../img/favicon/favicon-16x16.png">
    <link rel="manifest" href="/manifest.json">
    <meta name="msapplication-TileColor" content="#ffffff">
    <meta name="msapplication-TileImage" content="/ms-icon-144x144.png">
    <meta name="theme-color" content="#ffffff">

    <link rel="stylesheet" href="../css/main.css">
    <link rel="stylesheet" href="../css/font.css">
</head>
<body id="pass_body">
    <div class="content" id="pass"></div>
    <nav class="nav">
        <a href="./index.php" id="logoVinculo">
            <img src="../img/logo.png" alt="Logo de Toru" class="logo" id="logoShop">
        </a>
        <div class="control" id="control_pass">
            <a class="navLink" href="./register.php"> Unirse </a>
            <a class="navLink" href="./login.php"> Entrar </a>
        </div>
    </nav>
    <form action="#" method="POST" id="password" class="loginForm">
        <fieldset class="fieldset">

            <label for="new_username">Nombre de usuario:</label>
            <div class="inputContainer">
                <input class="inputs" type="text" name="new_username">
            </div>

            <label for="new_pass"> Contraseña: </label>
            <div class="inputContainer">
                <span class="icon-eye" onclick="mostrarContrasenia(this)"></span>
                <input type="password" class="inputs pass" id="pass" required autocomplete="off" name="new_pass">
            </div>

            <label for="new_pass">Nueva contraseña: </label>
            <div class="inputContainer">
                <span class="icon-eye" onclick="mostrarContrasenia(this)"></span>
                <input type="password" class="inputs pass" id="pass_confirmar" required autocomplete="off" name="new_pass2">
            </div>
            <p class="color-red warning opacity_0" id="error">  </p>

            <input type="submit" value="Modificar" name="new_pass_submit">
        </fieldset>
    </form>

    <footer class="footer footerSesion">
        <i> toru 2020 </i>
        <div id="footerRedes">
            <span class="icon-facebook"></span>
            <span class="icon-pinterest"></span>
            <span class="icon-instagram"></span>
            <span class="icon-twitter"></span>
        </div>
    </footer>
    <script src="../js/main.js"></script>
    <?php
        if (isset($_POST['new_pass_submit'])) {

            $username = $_POST['new_username'];
            $pass = $_POST['new_pass'];
            $pass2 = $_POST['new_pass2'];

            if( $pass == $pass2 ){
                $pass = md5($pass);
                $sql = "UPDATE usuario SET user_pass='$pass' WHERE user_username='$username'";

                if ( $mysqli->query($sql) ) {
                    echo '<script> location.href = "../../index.php" </script>';
                }
            }else{
                echo "<script> error(2) </script>";
            }
        }
    ?>
</body>
</html>