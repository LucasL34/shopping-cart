
var monto = 0;

var api_prod = "./assets/funciones/obtener_productos.php";
var api_user = "./assets/funciones/obtener_usuarios.php";

var $cart_UI = document.querySelector("#carrito_ui"); // cart body

var $comprar = document.querySelector("#prod-buy");
var $addCarrito = document.querySelector("#prod-cart_add");
var $content = document.querySelector(".content");

if ( document.querySelector("#index") ){ // in main page

    window.onload = function() {
        randomDesigners();
        fetchingData();
        innerCart($cart_UI);
        document.title = "Toru | Shop";
    };

}

if( document.querySelector("#producto_main") ){ // prod page

    window.onload = function () {
        verificarCarrito();
        cargarProducto();
        innerCart($cart_UI);
    }
}

if( document.querySelector("#filtrar_main") ){ // filter page
    window.onload = function(){
        verificarCarrito();
        cargarFiltro();
        randomDesigners();
        innerCart($cart_UI);
        document.title = "Toru | Filtrar producto";
    }
}


// web functions

function innerElement( $elemento, $destino ){ 
    $destino.innerHTML += $elemento;
}

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

$content.addEventListener("click", e => {

    var $post = e.target.parentElement;
    let postClass = $post.classList.value; // className value
    
    // change $post in different cases 
    if (postClass === "productoInfo" ) {
        $post = $post.parentElement;
    }else if(postClass === "prodInfoSection" ) {
        $post = $post.parentElement.parentElement;
    }

    let id = $post.getAttribute("data-id"); //get id from post

    if( id ){

        localStorage.setItem("prod_id", id); // save id 
        location.href = "./product.php?prod_id=" + id;

    }else{
        // no post click
        return null;
    }
    
});

function cardFactory(data){
    let Card = `<article class="post" data-id="${data.prod_id}" >
                <img src="./assets/img/productos/${data.prod_image}" class="prodPhoto" alt="${data.prod_nombre}">
                <div class="prodInfo">
                    <h4 class="prodNombre"> ${data.prod_nombre} </h4>
                    <hr class="separador">
                    <div class="prodInfoSection">
                        ${categoria(data.prod_review)}
                        <span> - </span>
                        <span class="precio">${data.prod_precio}</span>
                    </div>
                </div>
            </article>`;

    return Card;
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
            <div class="designersPost">
                <img src="./assets/img/designers/${data[i].des_id}.png" alt="Imagen de ${data[i].des_name}">
                <h2 class="designersName"> ${data[i].des_name} </h2>
                <small class="designersUsername"> @${data[i].des_username} </small>
            </div>`;
    }

    innerElement(designer, $design);
}

async function buy(id) {
    url = api_user + "?q=true&byid="+id;
    let response = await fetchData(url);
    
    var $comprar = document.querySelector("#prod-buy");
    //$comprar.id += " procesando_";
    $comprar.dataset.buy = "process";
    $comprar.value = "Procesando...";

    var datos = response[0];

    let obj = {
        prod_id: datos.prod_id,
        prod_nombre: datos.prod_nombre,
        prod_precio: datos.prod_precio,
        prod_image: datos.prod_image,
        prod_review: datos.prod_review,
        prod_descr: datos.prod_descr,
        prod_cant: (Number(datos.prod_cant) - 1 ),
        prod_empresa: datos.prod_empresa,
    };

    try{

        let response = await putData(api_prod, obj);

        setTimeout( function(){
            $comprar.value = "Comprado";
            $comprar.dataset.buy = "buy";
            cargarProducto();
        }, 1500);
        
        //$comprar.id = "prod_comprar";
    }catch (err) {
        console.error(err);
        $comprar.dataset.buy = "error";
        $comprar.value = "Error";
    }
}

function colocarProducto(data){
    const $carritoDiv = document.querySelector("#carrito_ui_section");

    document.querySelector("#precio_total").innerText = getMonto();
    $carritoDiv.innerHTML = data;   
}

async function verificarCarrito(){
    
    var id = localStorage.getItem("user_id");
    let url = api_user +"?q=true&byid="+id;

    var data = await fetchData(url);
    blockButton( data[0].prods_carrito );

    if(!id && document.querySelector("#producto_main") ){
        let $carrito__ = document.querySelector("#prod-cart_add");
        $carrito__.disabled = true;
        let $comprar__ = document.querySelector("#prod-buy");
        $comprar__.disabled = true;
    }
}

function blockButton(userProds){
    let id = localStorage.getItem("prod_id");
    let $cart__ = document.querySelector("#prod-cart_add");

    let arr = userProds.split(",");
    
    let arrSort = sortVector(arr);

    for (let i = 0; i<arrSort.length; i++) {
        if (id == arrSort[i]){
            $cart__.disabled = true;
            $cart__.value = "Producto ya agregado";
        }
    }
}

/* Filter */

async function cargarFiltro(){
    
    var $productos = document.querySelector("#productos");
    var form = JSON.parse(localStorage.getItem("form_f"));

    try{
        let response = await fetchData(api_prod);
        var data = response;
        for (let i in data){
            if( Number(data[i].prod_precio) < Number(form.precio) ) {
                if (form.review == "99" ){ // all 
                    innerElement( cardFactory(data[i]), $productos );
                }

                if (form.review == data[i].prod_review ) { // filter by review 
                    innerElement( cardFactory(data[i]), $productos );
                }
            }
        }   
    } catch (err) { console.error(err); }

    const $review = document.querySelector("#calificacion");
    var review__ = "";

        if(form.review == "99"){
            review__ = "Sin filtro";
        }else{
            review__ = categoria(form.review);
        }
    
    $review.children[0].outerHTML = `<option value="${form.review}" disabled selected hidden> ${review__} </option>`; // insert "sin filtro" in option 
    
    const $precio = document.querySelector("#precio");
    var precio__ = "";

        if(form.precio == "999999"){
            precio__ = "Sin filtro";
        }else{
            precio__ = "$"+form.precio;
        }
    
    $precio.children[0].outerHTML = `<option value="${form.precio}" disabled selected hidden> ${precio__} </option>`; 

        if($productos.children.length === 0){ // 0 products
            let $p = document.querySelector("#filtro_warning");
            $p.innerText = "No se han encontrado productos."; 
        }

}

/* Basics functions */ 

function sortVector(arr){
    
    let arrSort = arr.sort(function(a, b){ return a-b; });

    return arrSort;
}

function cerrarSesion() {

    localStorage.removeItem("user_id");

    if ( document.querySelector("#producto_main") ){  // when logout disabled buy & car buttons 
        let $cart_add = document.querySelector("#prod-cart_add");
        let $cart_buy = document.querySelector("#prod-buy");

        // disabled buttons 
        $cart_add.setAttribute("disabled", true);
        $cart_add.classList.add("disabled")
        
        $cart_buy.setAttribute("disabled", true);
        $cart_buy.classList.add("disabled")

    }

    location.href = "./assets/funciones/logout.php"; 
}

function recortarTitle(string) { 

    const limit = 10;
    var newString = "";

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

function setMonto(value) {
    value = Number(value);
    monto += value; 

} 
function getMonto() { return Math.round(monto * 100) / 100; } // round 