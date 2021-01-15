
// modificar todas las funciones y hacer inicio de sesion en php

var monto = 0;

var api_prod = "./assets/funciones/obtener_productos.php";
var api_user = "./assets/funciones/obtener_usuarios.php";

var $carrito = document.querySelector("#carrito");

if ( document.querySelector("#index") ){ // in main page

    window.onload = function() {
        randomDesigners();
        fetchingData();
        document.title = "Toru | Shop";
    };

}

if( document.querySelector("#producto_main") ){ // prod page

    window.onload = function () {
        verificarCarrito();
        cargarProducto();
    }
    if( false ){ // eliminar y hacerlo por php
        location.href = "./index.html";
    }
}

if( document.querySelector("#filtrar_main") ){ // filter page
    window.onload = function(){
        verificarCarrito();
        cargarFiltro();
        document.title = "Toru | Filtrar producto";
    }
}

const fetchData = (url) => { // get data from api
    return new Promise( (resolve, reject)=>{
        fetch( url , { method: "GET"} )
        .then( response => { return response.json() } )
        .then( data => { resolve(data.response) } )
        .catch( err => { console.error(err) } )
    });
};

async function fetchingData(){ // insert in web
    var url = api_prod + "/?q=true&prod_f=others"; // filter all products - business & toys
    var $productos = document.querySelector("#productos");
    var response = await fetchData(url);
    
    for (let i=0;i < response.length; i++) {
        innerElement( cardFactory(response[i]), $productos );
    }

    business();
    toys();
}

function innerElement( $elemento, $destino ){ 
    $destino.innerHTML += $elemento;
}

async function business(){

    var $empresario = document.querySelector("#business_prod");
    var $element = "";

    url = api_prod + "?q=true&prod_f=business";

    let response = await fetchData(url);

    for (let i = 0; i < response.length; i++) {
        $element += cardFactory(response[i]);
    }

    innerElement($element, $empresario);
}

async function toys(){

    var $toys = document.querySelector("#toys_prod");
    var url = api_prod + "?q=true&prod_f=teddies";
    var toys = "";

    let response = await fetchData(url);

    for (let i = 0; i < response.length; i++) {
        toys += cardFactory(response[i]);
    }

    innerElement(toys, $toys);
}

function cardFactory(data){
    let Card = `<article class="post" onclick="abrirPublicacion(${data.prod_id})">
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

    return Card;
}

async function randomDesigners(){
    var designer = "";
    let array = [];
    const $design = document.querySelector("#designers_prod");

    for (let i = 0; i < 3; i++) { // function + no repeat 
        array[i] = Math.floor(Math.random() * (18 - 1)) + 1;
    }

    var sortArray = array.sort(function (a, b) { return a - b; }); // sort array
    
    let url = api_user + "?q=true&designers=true"; //filter random id's
    url += "&id1="+sortArray[0];
    url += "&id2="+sortArray[1];
    url += "&id3="+sortArray[2];

    let data = await fetchData(url);

    for (let i in data) {
        designer += `
            <div class="designers_post">
                <img src="./assets/img/designers/${data[i].des_id}.png" alt="Imagen de ${data[i].des_name}">
                <h2 class="designers_name"> ${data[i].des_name} </h2>
                <small class="designers_username"> @${data[i].des_username} </small>
            </div>`;
    }

    innerElement(designer, $design);
}


async function cargarProducto(){
    var id = localStorage.getItem("id_prod");
    var urlbyId = api_prod + "?q=true&byid="+id;

    var $titulo = document.querySelector("#prod_titulo");
    var $descr = document.querySelector("#prod_descr_");
    var $review = document.querySelector("#prod_review_");
    var $precio = document.querySelector("#prod_precio_");
    var $img = document.querySelector("#prod_img_");
    var $stock = document.querySelector("#prod_stock");
    var $comprar = document.querySelector("#prod_comprar");
    var $empresa = document.querySelector("#prod_empresa_");

    var response = await fetchData(urlbyId);
    let prod = response[0];

    document.title = "Toru | " + prod.prod_nombre;
        // prod_nombre	prod_precio	prod_image	prod_review	prod_descr	prod_cant	propietario_empresa
    $titulo.innerText = prod.prod_nombre;
    $descr.innerText = prod.prod_descr;
    $review.innerHTML = categoria(prod.prod_review);
    $precio.innerText = prod.prod_precio;
    $img.setAttribute("src", "./assets/img/productos/" + prod.prod_image);
    $img.setAttribute("alt", prod.prod_nombre);
        if (Number(prod.prod_cant) > 0 ){
            $stock.innerText = prod.prod_cant;
        }else{
            $stock.classList.add("stocknt");
            $stock.innerHTML = 'SIN STOCK';
            $comprar.setAttribute("disabled", true);
            $comprar.classList.add("disabled");
        }

    $empresa.innerText = prod.prod_empresa;
}

const $comprar = document.querySelector("#prod_comprar");
const $addCarrito = document.querySelector("#prod_add_carrito");


async function comprar(id) {
    url = api_user + "?q=true&byid="+id;
    let response = await fetchData(url);
    restarStock( response[0] );
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

async function comprarTodo_(){
    let id = localStorage.getItem("user_id");
    url = api_user + "?q=true&byid="+id;
    let response = await fetchData(url);
    limpiarRegistroUsuario(response[0]);
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
            if( document.querySelector("#producto_main") ){
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

async function addCarrito(id) { // boton mediante html
    let url = api_prod + "?q=true&byid="+id;

    var data = await fetchData(url);

    actualizarUsuario(data[0], id);
}

function actualizarUsuario(data, id){

    var arr = {
        user_id: data.user_id,
        user_nombre: data.user_nombre,
        user_username: data.user_username,
        user_pass: data.user_pass,
        user_carrito: (data.prods_carrito+","+id), // update with id 
    };

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

async function MostrarCarrito(){ // abre el carritoUI

    let $carritoUI = document.querySelector("#carritoUI");
    let id = localStorage.getItem("user_id");
    let url = api_user + "?q=true&byid="+ id;

    $carritoUI.classList.toggle("display-none");

    if($carritoUI.className != "display-none") {

        var data = await fetchData(url);

        agregarProductosCarrito(data[0]);
        document.querySelector("#precioTotal").innerText = getMonto();

    }else{
        monto = 0;
    }
}

async function agregarProductosCarrito(carrito) {
    
    var data = await fetchData(api_prod);
    
    var j = 1;
    var arr = carrito.split(",");
    var arrayProds = arr.sort(function (a, b) { return a - b; });
    const $carritoDiv = document.querySelector("#carritoUI_section");
    var productosCar = "";

    for (let i in data) {
        if ( data[i].prod_id == arrayProds[j] ){
            productosCar += `
                <div class="carrito_div_">
                    <img src="./assets/img/productos/${data[i].prod_image}" alt="${data[i].prod_nombre}" class="carrito_img_">
                    <div class="carrito_div_section">
                        <h5> ${recortarTitle(data[i].prod_nombre)} </h5> 
                        <span class="prod_review_carrito"> ${categoria(data[i].prod_review)} </span>
                        <span class="prod_precio_carrito"> ${data[i].prod_precio} </span>
                        <span class="icon-cross"></span>
                    </div>
                </div>`;
            setMonto(Number(data[i].prod_precio));
            colocarProducto(productosCar);
            j++;
        }
    }
    
}

function colocarProducto(data){
    const $carritoDiv = document.querySelector("#carritoUI_section");

    document.querySelector("#precioTotal").innerText = getMonto();
    $carritoDiv.innerHTML = data;   
}

async function verificarCarrito(){
    
    var id = localStorage.getItem("user_id");
    let url = api_user +"?q=true&byid="+id;

    var response = await fetchData(url);
    bloquearBoton( response[0] );

    if(!id && document.querySelector("#producto_main") ){
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

/* Basics functions */ 

function cerrarSesion() {

    localStorage.removeItem("user_id");

    if ( document.querySelector("#producto_main") ){  // when logout disabled buy & car buttons 
        document.querySelector("#prod_add_carrito").setAttribute("disabled", true);
        document.querySelector("#prod_add_carrito").classList.add("disabled")
        document.querySelector("#prod_comprar").setAttribute("disabled", true);
        document.querySelector("#prod_comprar").classList.add("disabled")
    }

    location.href = "./assets/funciones/logout.php";
}

function abrirPublicacion(id) { // open card 
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
    const limit = 10;
    let newString = "";
    for (let i = 0; i < limit; i++) {
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

function setMonto(value) { monto += value; }
function getMonto() { return Math.round(monto * 100) / 100; }