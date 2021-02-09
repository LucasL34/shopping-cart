// show password input

function mostrarContrasenia(ojo) {
    const $pass = ojo.nextElementSibling; // select <input>

    if ($pass.type == "password") {
        $pass.type = "text";
        ojo.className = "icon-eye-blocked";
    } else {
        $pass.type = "password";
        ojo.className = "icon-eye";
    }

}
