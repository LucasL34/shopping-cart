
//var $fileName = document.URL.split("/");

//var arr = $fileName[$fileName.length - 1];
//var newFocus = arr.split("#");
var monto = 0;

var api_prod = "./assets/funciones/obtener_productos.php";
var api_user = "./assets/funciones/obtener_usuarios.php";

//newFocus[0] == "index.php" || newFocus[0] == "index.html"
if ( document.querySelector("#index") ){

    window.onload = function() {
        obtenerPublicacion();
        cargarUsuario();
        randomDesigners();
        document.title = "Toru | Shop";
    };

}

//var prodURL = newFocus[0].split("?");

//prodURL[0] == "producto.php" || prodURL[0] == "producto.html"
if( document.querySelector("#producto_main") ){

    window.onload = function () {
        cargarUsuario();
        verificarCarrito();
        cargarProducto();
    }
    if( prodURL[1] == undefined ){
        location.href = "./index.html";
    }
}

//prodURL[0] == "filtrar.php" || prodURL[0] == "filtrar.html"
if( document.querySelector("#filtrar_main") ){
    window.onload = function(){
        cargarUsuario();
        verificarCarrito();
        cargarFiltro();
        document.title = "Toru | Filtrar producto";
    }
}

function crearPublicacion( string, $destino ){
    $destino.innerHTML += string;
}


function obtenerPublicacion(){

    fetch(api_prod, { method: "GET" } )
    .then( response =>{
        return response.json();
    })
    .then( data =>{
        //6,3,14 corte empresario
        // 26, 29, 30 muñecos
        for(let i in data.response){

            var $empresario = document.querySelector("#ofertas_prod");
            var $productos = document.querySelector("#productos");
            var $juegos = document.querySelector("#muniecos_prod");

            if (data.response[i].prod_id != "6" && data.response[i].prod_id != "3" && data.response[i].prod_id != "14") {
                if (data.response[i].prod_id == "26" || data.response[i].prod_id == "29" || data.response[i].prod_id == "30") {
                    crearPublicacion( publicacionFactory(data.response[i]), $juegos);
                } else {
                    crearPublicacion(publicacionFactory(data.response[i]), $productos);
                }
            } else {
                crearPublicacion(publicacionFactory(data.response[i]), $empresario);
            }

        }
    })
    .catch( err =>{
        console.error(err);
    })
}

var $carrito = document.querySelector("#carrito");

function cargarUsuario(){
    var id = localStorage.getItem("user_id");
    var usuario = "";
    var creado = false;
    var $nav = document.querySelector("#control");

    $nav.innerHTML = "";

    if (id == undefined || id == null ){
        usuario += `<a class="navLink" href="./register.html"> Registrarse </a>
            <a class="navLink" href="./login.html"> Iniciar sesión </a>`;
    }else{
        usuario += `
            <div id="perfil">
                <img src="./assets/img/store.svg" alt="Icono de carrito" id="carrito" onclick="MostrarCarrito()">
                <span>!Hola, <b id="username_p"> Cargando... </b>!</span>
                <span class="icon-download3" onclick="cerrarSesion()">
            </div>
        `;
        creado = true;        
    }

    $nav.innerHTML += usuario;

    if (creado) {
        fetch(api_user, { method: "GET" })
        .then(response => {
            return response.json();
        })
        .then(data => {
            var $nombre = document.querySelector("#username_p");
            for (let i in data.response) {
                if (id == data.response[i].user_id) {
                    $nombre.innerText = data.response[i].user_username;
                }
            }
        })
        .catch(err => {
            console.error(err);
        })    
    }
}

function publicacionFactory(data){
    let string = "";

    string += `
            <article class="post" onclick="abrirPublicacion(${data.prod_id})">
                <img src="./assets/img/productos/${data.prod_image}" class="producto_foto" alt="${data.prod_nombre}">
                <div class="producto_info">
                    <h4 class="producto_nombre"> ${data.prod_nombre} </h4>
                    <hr class="separador">
                    <div class="producto_info_section">
                        ${categoria(data.prod_review)}
                        <span> - </span>
                        <span class="precio">${data.prod_precio}</span>
                    </div>
                </div>
            </article>`;

    return string;
}

function randomDesigners(){

    fetch(api_user, { method: "GET" })
        .then(response => {
            return response.json();
        })
        .then(data => {
            mostrarDesigners(data.response);
        })
        .catch(err => {
            console.error(err);
        })
}

function mostrarDesigners(data){
    const $design = document.querySelector("#designers_prod");
    var rand = [];
    var img = [];
    var designer = "";

    for (let i = 0; i < 3; i++) {
        rand[i] = Math.floor(Math.random() * (31 - 1)) + 1;
        img[i] = Math.floor(Math.random() * (18 - 0)) + 0;
    }
    
    var j = 0;
    var newRand = rand.sort(function (a, b) { return a - b; }); // ordenar array

    for (let i in data) {
        if(Number(data[i].user_id) == newRand[j] && j<3){
            designer += `
                <div class="designers_post">
                    <img src="./assets/img/designers/${img[j]}.png" alt="Imagen de ${data[i].user_nombre}">
                    <h2> @${data[i].user_username} </h2>
                    <span> ${data[i].user_nombre} </span>
                </div>
            `;
            j++;
        }
    }

    $design.innerHTML = designer;
}


function cargarProducto(){
    var id_p = localStorage.getItem("id_prod");

    fetch( api_prod, { method: "GET"} )
    .then( response=>{
        return response.json();
    })
    .then(data=>{
        for(let i in data.response){
            if(Number(data.response[i].prod_id) == id_p){
                document.title = "Toru | " + data.response[i].prod_nombre;
                // prod_nombre	prod_precio	prod_image	prod_review	prod_descr	prod_cant	propietario_empresa
                document.querySelector("#prod_titulo").innerText = data.response[i].prod_nombre;
                document.querySelector("#prod_descr_").innerText = data.response[i].prod_descr;
                document.querySelector("#prod_review_").innerHTML = categoria(data.response[i].prod_review);
                document.querySelector("#prod_precio_").innerText = data.response[i].prod_precio;
                document.querySelector("#prod_img_").setAttribute("src", "./assets/img/productos/" + data.response[i].prod_image);
                document.querySelector("#prod_img_").setAttribute("alt", data.response[i].prod_nombre);
                if (Number(data.response[i].prod_cant) > 0 ){
                    document.querySelector("#prod_stock").innerText = data.response[i].prod_cant;
                }else{
                    document.querySelector("#prod_stock").classList.add("stocknt");
                    document.querySelector("#prod_stock").innerHTML = 'SIN STOCK';
                    document.querySelector("#prod_comprar").setAttribute("disabled", true);
                    document.querySelector("#prod_comprar").classList.add("disabled");
                }
                document.querySelector("#prod_empresa_").innerText = data.response[i].prod_empresa;
            }
        }
    })
    .catch(err => {
        console.error(err);
    })
}

const $comprar = document.querySelector("#prod_comprar");
const $addCarrito = document.querySelector("#prod_add_carrito");


function comprar(id) {
    fetch( api_prod, { method: "GET" })
    .then( response=>{
        return response.json();
    })
    .then( data=>{
        for(let i in data.response){
            if(data.response[i].prod_id == id ){
                restarStock( data.response[i] );
            }
        }
    })
    .catch(err=>{
        console.error(err);
    })
}

function restarStock(producto_restar){

    var $comprar = document.querySelector("#prod_comprar");
    $comprar.value = "Procesando...";

    let datos = {
        prod_id: producto_restar.prod_id,
        prod_nombre: producto_restar.prod_nombre,
        prod_precio: producto_restar.prod_precio,
        prod_image: producto_restar.prod_image,
        prod_review: producto_restar.prod_review,
        prod_descr: producto_restar.prod_descr,
        prod_cant: (Number(producto_restar.prod_cant) - 1 ),
        prod_empresa: producto_restar.prod_empresa,
    };

    $comprar.id += " procesando_";

    fetch( api_prod, { 
        method: "PUT",
        body: JSON.stringify(datos),
        headers: { 'Content-Type' : 'application/json' }
    } )
    .then(response=>{
        return response.json();
    })
    .then(data=>{
        $comprar.value = "Comprar";
        $comprar.id = "prod_comprar";
        cargarProducto();
    })
    .catch(err=>{
        $comprar.value = "Error";
        console.error(err);
    })
}

function comprarTodo_(){
    fetch( api_user, {method: "GET"} )
    .then(response=>{
        return response.json();
    })
    .then(data=>{
        for(let i in data.response){
            if(data.response[i].user_id == localStorage.getItem("user_id")){
                limpiarRegistroUsuario(data.response[i]);
            }
        }
    })
}

function limpiarRegistroUsuario(usuario){

    var arr = {
        user_id: usuario.user_id,
        user_nombre: usuario.user_nombre,
        user_username: usuario.user_username,
        user_pass: usuario.user_pass,
        user_carrito: "0",
    };

    // user_nombre	user_username	user_pass	prods_carrito

    fetch( api_user, {
        method: "PUT",
        body: JSON.stringify(arr),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            let $carrito = document.querySelector("#prod_add_carrito-comprado_");
            monto = 0;
            document.querySelector("#precioTotal").innerText = getMonto();
            document.querySelector("#carritoUI_section").innerHTML = "";
            if (prodURL[0] == "producto.php" || prodURL[0] == "producto.html") {
                $carrito.value = "Añadir al carrito";
                $carrito.id = "prod_add_carrito";
                $carrito.removeAttribute("disabled");
                cargarProducto();
            }
        })
        .catch(err => {
          console.error(err);
        })
}

function addCarrito(id) { // boton mediante html

    fetch( api_user, { method: "GET"})
    .then(response=>{
        return response.json();
    })
    .then(data=>{
        for (let i in data.response) {
            if( data.response[i].user_id == localStorage.getItem('user_id')){
                actualizarUsuario(data.response[i], id);
            }
        }
    })
    .catch(err=>{
        console.error(err);
    })
}

function actualizarUsuario(data, id){

    var arr = {
        user_id: data.user_id,
        user_nombre: data.user_nombre,
        user_username: data.user_username,
        user_pass: data.user_pass,
        user_carrito: (data.prods_carrito+","+id),
    };

    // user_nombre	user_username	user_pass	prods_carrito

    fetch( api_user, { 
        method: "PUT",
        body: JSON.stringify(arr),
        headers: { 'Content-Type' : 'application/json' }
    } )
    .then(response=>{
        return response.json();
    })
    .then(data=>{
        $addCarrito.value = "Añadido";
        $addCarrito.id += "-comprado_";
        $addCarrito.setAttribute("disabled", true);
    })
    .catch(err=>{
        $addCarrito.value = "Error";
        console.error(err);
    })
}


function MostrarCarrito(){ // abre el carritoUI

    let $carritoUI = document.querySelector("#carritoUI");
    $carritoUI.classList.toggle("display-none");

    if($carritoUI.className != "display-none") {

        fetch( api_user, { method: "GET"} )
        .then( response=>{
            return response.json();
        })
        .then( data=>{
            for (let i in data.response ) {
                if( data.response[i].user_id == localStorage.getItem("user_id") ){
                    agregarProductosCarrito(data.response[i].prods_carrito);
                    document.querySelector("#precioTotal").innerText = getMonto();
                }
            }
        })
        .catch(err=>{
            console.error(err);
        })
    }else{
        monto = 0;
    }
}

function agregarProductosCarrito(carrito) {

    fetch( api_prod, { method: "GET"} )
    .then(response=>{
        return response.json();
    })
    .then(data=>{
        var j = 1;
        var carritoArr = carrito.split(",");
        var newArr = carritoArr.sort(function (a, b) { return a - b; });
        const $carritoDiv = document.querySelector("#carritoUI_section");
        var productosCar = "";

        for (let i in data.response) {
            if ( data.response[i].prod_id == newArr[j] ){
                productosCar += `
                    <div class="carrito_div_">
                        <img src="./assets/img/productos/${data.response[i].prod_image}" alt="${data.response[i].prod_nombre}" class="carrito_img_">
                        <div class="carrito_div_section">
                            <h5> ${recortarTitle(data.response[i].prod_nombre)} </h5> 
                            <span class="prod_review_carrito"> ${categoria(data.response[i].prod_review)} </span>
                            <span class="prod_precio_carrito"> ${data.response[i].prod_precio} </span>
                            <span class="icon-cross"></span>
                        </div>
                    </div>`;
                setMonto(Number(data.response[i].prod_precio));
                colocarProducto(productosCar);
                j++;
            }
        }
    })
    .catch(err=>{
        console.error(err);
    })
}


function colocarProducto(data){
    const $carritoDiv = document.querySelector("#carritoUI_section");

    document.querySelector("#precioTotal").innerText = getMonto();
    $carritoDiv.innerHTML = data;   
}

function verificarCarrito(){
    
    fetch( api_user , { method: "GET" } )
    .then( response=> {
        return response.json();
    })
    .then(data=>{
        for (let i in data.response ) {
            if (data.response[i].user_id == localStorage.getItem("user_id") ) {
                bloquearBoton( data.response[i] );
            }
        }
    })
    .catch(err=>{
        console.error(err);
    })

    if(!localStorage.getItem("user_id") && document.querySelector("#producto_main") ){
        let $carrito__ = document.querySelector("#prod_add_carrito");
        $carrito__.classList.add("disabled");
        $carrito__.setAttribute("disabled", true);
        let $comprar__ = document.querySelector("#prod_comprar");
        $comprar__.setAttribute("disabled", true);
        $comprar__.classList.add("disabled")
    }
}

function bloquearBoton(usuario_prod_id){

    fetch( api_prod, { method: "GET" } )
    .then(response=>{
        return response.json();
    })
    .then(data=>{
        let arr = usuario_prod_id.prods_carrito.split(",");
        let newArr = arr.sort(function(a, b){ return a-b; });
        let $carrito__ = document.querySelector("#prod_add_carrito");
        let j = 1;
        for(let i in data.response){
            if (data.response[i].prod_id == newArr[j] ){
                if (data.response[i].prod_id == localStorage.getItem("id_prod")){
                    $carrito__.classList.add("disabled");
                    $carrito__.setAttribute("disabled", true);
                    $carrito__.value = "Producto ya agregado";
                }
                j++;
            }
        }
    })
    .catch( err=>{
        console.error(err);
    })
}

/* Filtrar */ 

var $form_filtrar = document.querySelector("#form_s");

$form_filtrar.onsubmit = function(e){
    e.preventDefault();

    var precio_f = document.querySelector("#precio").value;
    var review_f = document.querySelector("#calificacion").value;

    var form_f = {
        "precio" : precio_f,
        "review" : review_f,
    }

    localStorage.setItem("form_f", JSON.stringify(form_f));
    
    location.href = "./filtrar.html";
    
}

function cargarFiltro(){
    
    var form = JSON.parse(localStorage.getItem("form_f"));

    fetch( api_prod, { method: "GET" } )
    .then(response => {
        return response.json();
    })
    .then(data => {

        var $productos = document.querySelector("#productos");

        for (let i in data.response) {
            if( Number(data.response[i].prod_precio) < Number(form.precio) ) {
                if (form.review == "99" ){
                    crearPublicacion( publicacionFactory(data.response[i]), $productos );
                }
                if (form.review == data.response[i].prod_review ) {
                    crearPublicacion(publicacionFactory(data.response[i]), $productos );
                }
            }
        }
    })
    .catch(err => {
        console.error(err);
    })

    let $review = document.querySelector("#calificacion");
    var review__ = "";
    if(form.review == "99"){
        review__ = "Sin filtro";
    }else{
        review__ = categoria(form.review);
    }
    
    $review.children[0].outerHTML = `<option value="${form.review}" disabled selected hidden> ${review__} </option>`;
    
    let $precio = document.querySelector("#precio");
    var precio__ = "";
    if(form.precio == "999999"){
            precio__ = "Sin filtro";
        }else{
            precio__ = "$"+form.precio;
        }
    $precio.children[0].outerHTML = `<option value="${form.precio}" disabled selected hidden> ${precio__} </option>`;

}

/* Funciones basicas */ 

function cerrarSesion() {
    localStorage.removeItem("user_id");
    if (prodURL[0] == "producto.php" || prodURL[0] == "producto.html" ){
        document.querySelector("#prod_add_carrito").setAttribute("disabled", true);
        document.querySelector("#prod_add_carrito").classList.add("disabled")
        document.querySelector("#prod_comprar").setAttribute("disabled", true);
        document.querySelector("#prod_comprar").classList.add("disabled")
    }
    cargarUsuario();
}

function abrirPublicacion(id) {
    localStorage.setItem("id_prod", id);
    location.href = "./producto.html?prod_id=" + id;
}

function mostrarContrasenia(ojo) {

    const $pass = ojo.nextElementSibling;

    if ($pass.type == "password") {
        $pass.type = "text";
        ojo.className = "icon-eye-blocked";
    } else {
        $pass.type = "password";
        ojo.className = "icon-eye";
    }

}

function recortarTitle(string) {
    const limite = 10;
    let newString = "";
    for (let i = 0; i < limite; i++) {
        newString += string[i];
    }
    newString += "...";
    return newString;
}

function categoria(categoria) {
    var value = Number(categoria);
    var review = '';
    switch (value) {
        case 0:
            review += '<span class="muy_bueno review"> Muy bueno'; break;
        case 1:
            review += '<span class="bueno review"> Bueno'; break;
        case 2:
            review += '<span class="regular review"> Regular'; break;
        case 3:
            review += '<span class="malo review"> Malo'; break;
        case 4:
            review += '<span class="muy_malo review"> Muy malo'; break;
    }

    review += " </span>";

    return review;
}
function setMonto(value) { monto += value; }
function getMonto() { return Math.round(monto * 100) / 100; }