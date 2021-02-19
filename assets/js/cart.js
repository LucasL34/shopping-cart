// cart 

function innerCart($cart){

    let $cartElement = `
        <h2> Carrito </h2>
            <p id="carrito_p"></p>
            <div id="carrito_ui_section"></div>
            <hr>
            <div id="mostrar_total">
                <input type="submit" id="comprar_todo" value="Comprar todo" onclick="buyCart()">
                <span id="precio_total"></span>
            </div>`;
    
    innerElement($cartElement, $cart);
}

async function MostrarCarrito(){ // abre el carritoUI w/ html 

    var id = localStorage.getItem("user_id");
    var url = api_user + "?q=true&byid="+ id;
    var cart_attr = $cart_UI.getAttribute("data-cart");
    var $cartSection = document.querySelector("#carrito_ui_section"); // cart's post container 
    var data = await fetchData(url);

    // switch mode 
    if(cart_attr == "hidden"){
        verifyCantCart($cartSection); 

        loadList(data[0].prods_carrito);

        $cart_UI.dataset.cart = "show";
    }else{
        $cart_UI.dataset.cart = "hidden";
        $cartSection.innerHTML = ""; // empty container 
    }

    if(cart_attr == "show") {

        try {

            document.querySelector("#precio_total").innerText = getMonto();

        } catch (err) { console.error(err); }

    }else{
        monto = 0;
    }
}

function verifyCantCart($cart){
    let items = $cart.children.length;
    
    var $money = document.querySelector("#precio_total");

    if(items === 0){
        cartMessage("Sin productos agregados:(");
        $money.innerText = "0";
    }else{
        $money.innerText = getMonto();
        cartMessage("");
    }
}

async function innerProdList(data, $e){

    //console.log(data);
    //return false;
    var $cart = document.querySelector("#carrito_ui_section");
    let id = localStorage.getItem("user_id");
    let $div = `
        <div class="carritoDiv_">
            <img src="./${data.img}" alt="${data.name}" class="carritoImg_">
            <div class="carritoDivSection">
                <h5> ${recortarTitle(data.name)} </h5> 
                <span class="prodPrecioCart"> ${data.price} </span>
                <span title="Eliminar producto" data-id="${data.id}" class="icon-cross"></span>
            </div>
        </div>`;
    
    innerElement($div, $e);

    setMonto(data.price);

    verifyCantCart($cart);

    saveProds(data.id, id);
}

async function saveProds(id_p, id_u){

    let  url = api_user + "?q=true&byid="+id_u;
    let obj = {};
    var data = await fetchData(url);

    let prodArray = data[0].prods_carrito.split(",");
    let arr = sortVector(prodArray);

    var repeat = false;

    for (let i = 0; i < arr.length; i++) {
        if(arr[i] === id_p){
            repeat = true;
        }
    }

    if(!repeat){ // no repeat id 
        obj = {
            user_id: data[0].user_id,
            user_nombre: data[0].user_nombre,
            user_username: data[0].user_username,
            user_pass: data[0].user_pass,
            user_carrito: (data[0].prods_carrito+","+id_p), // update with id 
        };

        try {
            let data = await putData(url, obj);

        } catch (error) { console.error(error) }
    }
    
    return null;

}

async function buyCart(){
    // redireccionar a otra pagina y comprar ahi 

    return false; 

    let id = localStorage.getItem("user_id");

    url = api_user + "?q=true&byid="+id;
    try {
        let response = await fetchData(url);

        clearCarrito(response[0]);
    } catch (err) {
        console.error(err);
    }
    
}

async function clearCarrito(usuario){

    return false;

    var obj = {
        user_id: usuario.user_id,
        user_nombre: usuario.user_nombre,
        user_username: usuario.user_username,
        user_pass: usuario.user_pass,
        user_carrito: "0",
    };

    var $carrito_btn = document.querySelector("#prod_add_carrito-comprado_");
    let $cartSection = document.querySelector("#carrito_ui_section");
        var response = await putData(api_user, obj);

    monto = 0;
    document.querySelector("#precio_total").innerText = getMonto();
    $cartSection.innerHTML = "";

    if( document.querySelector("#producto_main") ){ // producto.php
        $carrito_btn.value = "Añadir al carrito";
        $carrito_btn.removeAttribute("disabled");
        $carrito_btn.id = "prod_add_carrito";
        cargarProducto(); // update info 
    }

    cartMessage("Gracias por comprar");
    
}

async function loadList(prodArr){

    cartMessage("Cargando...");

    var url = api_prod + "?q=true&byid=";

    let $element = document.querySelector("#carrito_ui_section");
    let $e = "";
    let a = prodArr.split(",");
    let arr = sortVector(a);

    for (let i = 1; i < arr.length; i++) {
        //console.log(arr[i]);
        let newUrl = url + arr[i];

        let data = await fetchData(newUrl);

        let obj = { //id. name, img, price 
            id : data[0].prod_id,
            name: data[0].prod_nombre,
            img: "assets/img/productos/" + data[0].prod_image,
            price: data[0].prod_precio,
        }

        innerProdList(obj, $element);

        newUrl = url; // restart url 
    }

}

function cartMessage(message){
    let $p = document.querySelector("#carrito_p");

    $p.innerText = message;
}

var $button_add_cart = document.querySelector("#prod-cart_add");

$button_add_cart.addEventListener("click", async function(){

    let $cartSection = document.querySelector("#carrito_ui_section");

    var id_prod = localStorage.getItem("prod_id");
    var name = document.querySelector("#prod_titulo").textContent;
    var price = document.querySelector("#prod_precio_").textContent;
    let imgSrc = document.querySelector("#prod_img_").src.split("carrito/");
    let img = imgSrc[1];

    var prod_data = {
        id : id_prod,
        name : name,
        price: price,
        img : img,
    }

    innerProdList(prod_data, $cartSection);

    try{
        //var response = await putData(url, obj); // cambiar por url

        $addCarrito.value = "Añadido";
        $addCarrito.dataset.add = "add";
        $addCarrito.disabled = true;

    }catch(err){

        console.error(err);
        $addCarrito.dataset.add = "error";
        $addCarrito.value = "Error";

    }
});
