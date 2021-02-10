// function in product.php

async function cargarProducto(){
    
    var id = localStorage.getItem("prod_id");
    var urlbyId = api_prod + "?q=true&byid="+id;
    var response = await fetchData(urlbyId);

    var $comprar = document.querySelector("#prod-buy");

    

    var $title = document.querySelector("#prod_titulo");
    var $descr = document.querySelector("#prod_descr_");
    var $review = document.querySelector("#prod_review_");
    var $precio = document.querySelector("#prod_precio_");
    var $img = document.querySelector("#prod_img_");
    var $stock = document.querySelector("#prod_stock");
    var $empresa = document.querySelector("#prod_empresa_");

    let prod = response[0];

    document.title = "Toru | " + prod.prod_nombre;
    // prod_nombre	prod_precio	prod_image	prod_review	prod_descr	prod_cant	propietario_empresa
    $title.innerText = prod.prod_nombre;
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
            //$comprar.dataset.buy = "disabled";
        }

    $empresa.innerText = prod.prod_empresa;
}
