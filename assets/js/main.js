
var monto = 0;

var api_prod = "./assets/funciones/obtener_productos.php";
var api_user = "./assets/funciones/obtener_usuarios.php";

var $cart_UI = document.querySelector("#carritoUI"); // cart body

var $comprar = document.querySelector("#prod_comprar");
var $addCarrito = document.querySelector("#prod_add_carrito");

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

function innerCart($cart){

    let $cartElement = `
        <h2> Carrito </h2>

            <p id="carrito_p"> Sin productos agregados:( </p>
            <div id="carritoUI_section"></div>
            <hr>
            <div id="mostrarTotal">
                <input type="submit" id="comprar_todo" value="Comprar todo" onclick="buyCarrito()">
                <span id="precioTotal"></span>
            </div>
    `;
    
    innerElement($cartElement, $cart);
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

async function buy(id) {
    url = api_user + "?q=true&byid="+id;
    let response = await fetchData(url);

    var $comprar = document.querySelector("#prod_comprar");
    $comprar.id += " procesando_";
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
        $comprar.value = "Comprar";
        $comprar.id = "prod_comprar";
        cargarProducto();
    }catch (err) {
        console.error(err);
        $comprar.value = "Error";
    }
}

async function listProds(carrito) {
    
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

    var data = await fetchData(url);
    blockButton( data[0].prods_carrito );

    if(!id && document.querySelector("#producto_main") ){
        let $carrito__ = document.querySelector("#prod_add_carrito");
        $carrito__.classList.add("disabled");
        $carrito__.setAttribute("disabled", true);
        let $comprar__ = document.querySelector("#prod_comprar");
        $comprar__.setAttribute("disabled", true);
        $comprar__.classList.add("disabled")
    }
}

function blockButton(userProds){
    let id = localStorage.getItem("prod_id");
    let $cart__ = document.querySelector("#prod_add_carrito");

    let arr = userProds.split(",");
    let arrSort = arr.sort(function(a, b){ return a-b; });

    for (let i = 0; i<arrSort.length; i++) {
        if (id == arrSort[i]){
            $cart__.classList.add("disabled");
            $cart__.setAttribute("disabled", true);
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
    localStorage.setItem("prod_id", id);
    location.href = "./producto.php?prod_id=" + id;
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

function setMonto(value) { monto += value; }
function getMonto() { return Math.round(monto * 100) / 100; }