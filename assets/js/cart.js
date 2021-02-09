// cart 

async function MostrarCarrito(){ // abre el carritoUI w/ html

    var id = localStorage.getItem("user_id");

    var url = api_user + "?q=true&byid="+ id;

    //$cart.innerHTML = ""; // empty div 
    //innerCarrito($cart); // insert cart 

    $cart_UI.classList.toggle("display-none"); // show div

    if($cart_UI.className != "display-none") {

        try {
            let $cartSection = document.querySelector("#carritoUI_section"); // cart's post container 
            let $cartChildrens = $cartSection.children;
            var data = await fetchData(url);
        
            listProds( data[0].prods_carrito );
            document.querySelector("#precioTotal").innerText = getMonto();    

            if ($cartChildrens.length === 0) {
                let $p = document.querySelector("#carrito_p");
                //$p.style.display = "none";
                //$p.innerText = "Sin productos agregados:(";
                $p.innerText = "";
            }

        } catch (err) {
            console.error(err);
        }

    }else{
        monto = 0;
    }

}

async function buyCarrito(){
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

    var obj = {
        user_id: usuario.user_id,
        user_nombre: usuario.user_nombre,
        user_username: usuario.user_username,
        user_pass: usuario.user_pass,
        user_carrito: "0",
    };

    var $carrito_btn = document.querySelector("#prod_add_carrito-comprado_");
    var $p = document.querySelector("#carrito_p");
    let $cartSection = document.querySelector("#carritoUI_section");         
        var response = await putData(api_user, obj);

    monto = 0;
    document.querySelector("#precioTotal").innerText = getMonto();
    $cartSection.innerHTML = "";

    if( document.querySelector("#producto_main") ){ // producto.php
        $carrito_btn.value = "Añadir al carrito";
        $carrito_btn.removeAttribute("disabled");
        $carrito_btn.id = "prod_add_carrito";
        cargarProducto(); // update info 
    }

    $p.innerText = "Gracias por comprar";

        /*if( $cartChildrens.length === 0 ){
            $p.innerText = "Gracias por comprar";
        }*/
        
}

async function addCarrito(id, username) { // boton mediante html - id prod 
    let url = api_user + "?q=true&user_f=name&name="+username;

    var data = await fetchData(url);

    let obj = {
        user_id: data[0].user_id,
        user_nombre: data[0].user_nombre,
        user_username: data[0].user_username,
        user_pass: data[0].user_pass,
        user_carrito: (data[0].prods_carrito+","+id), // update with id 
    };

    try{
        var response = await putData(api_user, obj);

        $addCarrito.value = "Añadido";
        $addCarrito.id += "-comprado_";
        $addCarrito.setAttribute("disabled", true);
    }catch(err){
        console.error(err);
        $addCarrito.value = "Error";
    }
}
