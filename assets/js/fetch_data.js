// obtain info from api 

const putData = (url, obj) => {
    // restar cantidad, = 0, sumar id
    // pasarle el obj directamente y no crearlo aca 
    
    return new Promise( (resolve, reject)=>{
        fetch( url, { 
            method: "PUT",
            body: JSON.stringify(obj),
            headers: { 'Content-type' : 'application/json'}
        })
        .then( response=>{ return response.json() }) 
        .then( data =>{ resolve(data.response) })
        .catch( err => {
            reject(new Error('Error: '+err))
        })
    });
}

const fetchData = (url) => { // get data from api
    return new Promise( (resolve, reject)=>{
        fetch( url , { method: "GET"} )
        .then( response => { return response.json() } )
        .then( data => { resolve(data.response) } )
        .catch( err => { console.error(err) } )
    });
};
