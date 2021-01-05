
//let $fileNameAccount = document.URL.split("/");

//const archivoFocusAccount = $fileName[$fileName.length - 1];
const $form = document.querySelector(".loginForm");
var carrito = "0";

window.onload = function(){
    error();
}

if ( document.querySelector("#login") ){

    $form.onsubmit = event => {
        event.preventDefault();
        getBaseDatos();
    }

}
if( document.querySelector("#register") ){
    $form.onsubmit = event => {
        event.preventDefault();
        getBaseDatos(true);
    }
}

function validarIndex(usuarios){
    const username = document.querySelector("#username").value;
    const pass = document.querySelector("#pass").value;
    var registro_u = false;

    for(var i in usuarios){
        if( username == usuarios[i].user_username && pass == usuarios[i].user_pass ){
            registro_u = true;
            localStorage.setItem("user_id" , usuarios[i].user_id);
            location.href = "./index.html";
        }
    }

    if(!registro_u){
        error(1);
    }
}

function validarRegistro(usuarios){

    const nombre = document.querySelector("#nombreCompleto").value;
    const username = document.querySelector("#username_r").value;
    const pass = document.querySelector("#pass").value;
    const pass_conf = document.querySelector("#pass_confirmar").value;

    var usuarioExistente = false;

    if(pass === pass_conf){
        for (let i in usuarios) {
            if (username == usuarios[i].user_username && !usuarioExistente) {
                error(2);
                usuarioExistente = true;
            }
        }

        if(!usuarioExistente){
            let data = {
                nombre_completo: nombre,
                username_r: username,
                pass_r: pass,
                carrito: carrito,
            };

            document.querySelector("#registro__").value = "Procesando...";

            fetch( api_user, {
                method: "POST",
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            })
            .then(response => {
                return response.json();
            })
            .then(data => {
                document.querySelector("#registro__").value = "Registrado";
                location.href="./login.html";
            })
            .catch(err => {
                document.querySelector("#registro__").value = "Reintentar";
                error(99);
                console.error(err);
            })
        }

    }else{
        error(0);
    }

}

function getBaseDatos(post){

    fetch( api_user , { method: "GET" } )
    .then(response=>{
        return response.json();
    })
    .then(data => {
        if(post){
            validarRegistro(data.response);
        }else{
            validarIndex(data.response);
        }
    })
    .catch(err=>{
        console.error(err);
    })
}


function error(nro){
    const $error = document.querySelector("#error");

    switch (nro) {
        case 0:
            $error.innerText = "Las contraseñas no coinciden.";
            $error.classList.remove("opacity_0")
            break;
        case 1:
            $error.innerText = "Usuario no registrado, verificar nombre de usuario.";
            $error.classList.remove("opacity_0")
            break;
        case 2: 
            $error.innerText = "Nombre de usuario ya registrado, intente con otro.";
            $error.classList.remove("opacity_0")
            break;
        default:
            $error.innerText = "Contraseña o nombre de usuario incorrectos.";
    }

}