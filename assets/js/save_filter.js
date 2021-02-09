// save filter values w/ localstorage

var $form_filter = document.querySelector("#form_s"); // select form html

$form_filter.onsubmit = function(e){ // stop submit
    e.preventDefault();

    var precio_f = document.querySelector("#precio").value; // get value of input
    var review_f = document.querySelector("#calificacion").value; 

    var form_f = {
        "precio" : precio_f,
        "review" : review_f,
    }

    localStorage.setItem("form_f", JSON.stringify(form_f)); //save values
    
    location.href = "./filtrar.php"; // redirect to filter page
    
}
