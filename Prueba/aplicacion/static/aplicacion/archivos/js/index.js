//****************** DECLARACION DE VARIABLES **************************************************************
const $deleteModal = document.getElementById("deleteModal");
const $deleteSpan = document.getElementById("closeDeleteModal");
const $deleteModalTittle = document.querySelector(".delete-modal-title");
const $deleteModalQuestion = document.querySelector(".delete-modal-question");
const $btnDeleteConfirm = document.getElementById("deleteConfirm");
const $btnDeleteCancel = document.getElementById("deleteCancel");

const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

const $productModal = document.getElementById("productModal");
const $productSpan = document.getElementById("closeProductModal");
const $btnAddProduct = document.getElementById("btn-add-product");
const $productTable = document.querySelector(".product-crud-table");
const $productTemplate = document.getElementById("product-crud-template").content;
const $productfragment = document.createDocumentFragment();
const $productForm = document.querySelector(".product-crud-form");
const $productCrudTittle = document.querySelector(".product-crud-title");

const $orderModal = document.getElementById("orderModal");
const $orderSpan = document.getElementById("closeOrderModal");
const $btnAddOrder = document.getElementById("btn-add-order");
const $orderTable = document.querySelector(".order-crud-table");
const $orderTemplate = document.getElementById("order-crud-template").content;
const $orderfragment = document.createDocumentFragment();
const $orderForm = document.querySelector(".order-crud-form");
const $orderCrudTittle = document.querySelector(".order-crud-title");
const $orderDetailForm = document.querySelector(".orderDetail-crud-form");
const $orderDetailTemplate = document.getElementById("order-details-template").content;
const $orderDetailFragment = document.createDocumentFragment();

const $addDetailModal = document.getElementById("addDetailModal");
const $addDetailSpan = document.getElementById("closeAddDetailModal");
const $addDetailForm = document.querySelector(".create-detailOrder-form");

let fecha;
let usedProducts = [];
//*************** FIN DECLARACION DE VARIABLES ******************************************************

//READ DE PRODUCTOS
const getProducts = async () => {
    try {
        let response = await fetch("https://testserializer.herokuapp.com/requests/products/");
        let json = await response.json();

        if(!response.ok) throw {status: response.status, statusText: response.statusText};

        json.forEach(element => {

            $productTemplate.querySelector('.id').textContent = element.id;
            $productTemplate.querySelector('.name').textContent = element.name;
            $productTemplate.querySelector('.price').textContent = element.price;

            $productTemplate.querySelector('.btnEditProduct').dataset.id = element.id;
            $productTemplate.querySelector('.btnEditProduct').dataset.name = element.name;
            $productTemplate.querySelector('.btnEditProduct').dataset.price = element.price;
            $productTemplate.querySelector('.btnEditProduct').dataset.url = element.url;

            $productTemplate.querySelector('.btnDeleteProduct').dataset.url = element.url;

            let $clone = document.importNode($productTemplate, true);
            $productfragment.appendChild($clone);  
        });

        $productTable.querySelector("tbody").appendChild($productfragment);

    } catch (error) {
        let message = error.statusText || 'Ocurrio un error';
        $productTable.insertAdjacentHTML("afterend",`<p><b>Error ${error.status}: ${message}</b></p>`);
    }

}

//READ DE ORDENES
const getOrders = async () => {
    try {
        let response = await fetch("https://testserializer.herokuapp.com/requests/orders/");
        let json = await response.json();

        if(!response.ok) throw {status: response.status, statusText: response.statusText};

        json.forEach(element => {
            fecha = new Date(element.date_time);

            $orderTemplate.querySelector('.id').textContent = element.id;
            $orderTemplate.querySelector('.date').textContent = fecha.toLocaleDateString();
            $orderTemplate.querySelector('.total').textContent = element.get_total;

            $orderTemplate.querySelector('.btnOrderDetail').dataset.id = element.id;
            $orderTemplate.querySelector('.btnOrderDetail').dataset.date = element.date_time;
            $orderTemplate.querySelector('.btnOrderDetail').dataset.total = element.get_total;
            $orderTemplate.querySelector('.btnOrderDetail').dataset.url = element.url;

            let $clone = document.importNode($orderTemplate, true);
            $orderfragment.appendChild($clone);  
        });

        $orderTable.querySelector("tbody").appendChild($orderfragment);

    } catch (error) {
        let message = error.statusText || 'Ocurrio un error';
        $orderTable.insertAdjacentHTML("afterend",`<p><b>Error ${error.status}: ${message}</b></p>`);
    }

}

//METODOS CREATE Y UPDATE
document.addEventListener("submit", async e =>{
    //PRODUCTO
    if (e.target === $productForm){
        e.preventDefault();
        //METODO CREATE
        if(!e.target.urlProduct.value){
            try {
                if(!parseFloat(e.target.priceProduct.value)) throw "Precio debe ser numero";

                let options = {
                    method: "POST",
                    headers: {
                        "X-CSRFToken": csrftoken,
                        "Content-Type": "application/json; charset=UTF-8"                                      
                    },
                    body: JSON.stringify({
                        "id" : e.target.idProduct.value,
                        "name" : e.target.nameProduct.value,
                        "price" : e.target.priceProduct.value
                    })
                };
                let response = await fetch("https://testserializer.herokuapp.com/requests/products/", options);

                if(!response.ok) throw response;

                window.alert("Operación Exitosa");
                location.reload();
                
            } catch (error) {
                switch (error) {
                    case "Precio debe ser numero":
                        window.alert(error);
                        break;

                    default :
                        window.alert(`El campo Id debe ser unico y no debe sobrepasar los 20 caracteres`);
                }
            }
        }else{
            //METODO UPDATE
            try {
                if(!parseFloat(e.target.priceProduct.value)) throw "Precio debe ser numero";

                let options = {
                    method : 'PUT',
                    headers : {
                        "X-CSRFToken": csrftoken,
                        "Content-Type": "application/json; charset=UTF-8"                        
                    },
                    body: JSON.stringify({
                        "id" : e.target.idProduct.value,
                        "name" : e.target.nameProduct.value,
                        "price" : e.target.priceProduct.value
                    })
                };
                let response = await fetch(e.target.urlProduct.value, options);

                if(!response.ok) throw {status : response.status, statusText : response.statusText};
                window.alert("Operación Exitosa");
                location.reload();

            } catch (error) {
                if(error == "Precio debe ser numero"){
                    window.alert(error);
                }else{
                    let message = error.statusText || "Ocurrió un error";
                    window.alert(`Error ${error.status}: ${message}`); 
                }    
            }
        }
    }

    //ORDENES
    if(e.target === $orderForm){
        e.preventDefault();
        //METODO CREATE
        if(!e.target.urlOrder.value){
            try {
                let options = {
                    method: "POST",
                    headers: {
                        "X-CSRFToken": csrftoken,
                        "Content-Type": "application/json; charset=UTF-8"                                      
                    },
                    body: JSON.stringify({
                        "date_time" : e.target.dateOrder.value
                    })
                };
                let response = await fetch("https://testserializer.herokuapp.com/requests/orders/", options);
                if (!response.ok) throw response;

                window.alert("Operación Exitosa");
                location.reload();
            } catch (error) {
                window.alert(error.status, error.statusText);
            }
        }else{
            //METODO UPDATE
            try {
                let options = {
                    method: "PUT",
                    headers: {
                        "X-CSRFToken": csrftoken,
                        "Content-Type": "application/json; charset=UTF-8"                                      
                    },
                    body: JSON.stringify({
                        "date_time" : e.target.dateOrder.value
                    })
                };

                let response = await fetch(e.target.urlOrder.value, options);
                if (!response.ok) throw response;

                window.alert("Operación Exitosa");
                location.reload();
                
            } catch (error) {
                window.alert(error.status, error.statusText);
            }
        }
    }

    //CREATE DETALLES DE ORDEN
    if(e.target === $addDetailForm){
        e.preventDefault();
        try {
            let response = await fetch("https://testserializer.herokuapp.com/requests/products/");
            let allProducts = await response.json();
            let bandera = false;

            if (!response.ok) throw response.status;

            if(e.target.cuantity.value == null || e.target.cuantity.value.trim() == '' || isNaN(e.target.cuantity.value) || !parseFloat(e.target.cuantity.value) > 0) throw "Cantidad debe ser numero y mayor a 0";

            if(e.target.productName.value == null || e.target.productName.value.trim() == '') throw "Ingrese un nombre valido";

            allProducts.forEach(element => {
                if (e.target.productName.value == element.name){
                    bandera = true;
                    actualProduct = element;
                }
            });

            if(!bandera) throw "El producto no existe";

            if (usedProducts.includes(actualProduct.url)) throw "No pueden repetirse productos en una misma orden";

            let precioOrden = e.target.cuantity.value * actualProduct.price;

            let decision = window.confirm(`Desea agregar el producto con precio: ${actualProduct.price}, el total de la orden es: ${precioOrden}`);
            
            if (decision) {

                let options = {
                    method: "POST",
                    headers: {
                        "X-CSRFToken": csrftoken,
                        "Content-Type": "application/json; charset=UTF-8"                                      
                    },
                    body: JSON.stringify({
                        "order" : e.target.urlOrder.value,
                        "cuantity" : e.target.cuantity.value,
                        "price" : precioOrden,
                        "product" : actualProduct.url
                    })
                };           

                response = await fetch ("https://testserializer.herokuapp.com/requests/orderDetails/", options);
                if (!response.ok) throw response.status;

                window.alert("Operación Exitosa");
                location.reload();
            }
        } catch (error) {
            window.alert(error);
        }
    }
});

//MOSTRAR TABLAS
document.addEventListener("DOMContentLoaded", e => {
    getProducts();
    getOrders();
});

//DELEGACION DE EVENTOS SOBRE CLICK
document.addEventListener("click", async e =>{
    //BOTON AGREGAR PRODUCTO
    if (e.target === $btnAddProduct){
        $productCrudTittle.textContent = "Agregar Producto";
        $productModal.style.display = "block";
    }

    //CERRAR MODAL PRODUCTOS
    if (e.target === $productSpan || e.target === $productModal){
        $productModal.style.display = "none";
        $productForm.idProduct.value = null;
        $productForm.idProduct.disabled = false;
        $productForm.nameProduct.value = null;
        $productForm.priceProduct.value = null;
        $productForm.urlProduct.value = null;        
    }

    //BOTON EDITAR PRODUCTO
    if (e.target.matches(".btnEditProduct")){
        $productCrudTittle.textContent = "Editar Producto";
        $productForm.idProduct.value = e.target.dataset.id;
        $productForm.idProduct.setAttribute("disabled", true);
        $productForm.nameProduct.value = e.target.dataset.name;
        $productForm.priceProduct.value = e.target.dataset.price;
        $productForm.urlProduct.value = e.target.dataset.url;
        $productModal.style.display = "block";
    }

    //BOTON BORRAR PRODUCTO
    if (e.target.matches(".btnDeleteProduct")){
        $btnDeleteConfirm.dataset.mode = 'single';
        $btnDeleteConfirm.dataset.url = e.target.dataset.url;
        $deleteModalTittle.textContent = "Eliminar Producto";
        $deleteModalQuestion.textContent = "Deseas eliminar el producto seleccionado?"
        $deleteModal.style.display = "block";
    }

    //CERRAR MODAL DELETE PRODUCTO
    if (e.target === $deleteSpan || e.target === $deleteModal || e.target === $btnDeleteCancel){
        $btnDeleteConfirm.dataset.url = null;
        $deleteModal.style.display = "none";
        $btnDeleteConfirm.dataset.mode = null;
    } 

    //METODOS DELETE 
    if (e.target === $btnDeleteConfirm){
        //METODO DELETE DETALLE DE ORDEN Y PRODUCTO
        if(e.target.dataset.mode == 'single'){
            try {
                let options = {
                    method : 'DELETE',
                    headers : {
                        "X-CSRFToken": csrftoken,
                        "Content-Type": "application/json; charset=UTF-8"                        
                    },
                };
                let response = await fetch(e.target.dataset.url,options);
    
                if(!response.ok) throw {status : response.status, statusText : response.statusText};
                window.alert("Operación Exitosa");
                location.reload();
    
            } catch (error) {
                window.alert(`Error ${error.status}: ${error.message}`);
            }
        }

        //METODO DELETE ORDEN
        if(e.target.dataset.mode == 'order'){
            try {
                let response = await fetch("https://testserializer.herokuapp.com/requests/orderDetails/");
                let json = await response.json();

                let options = {
                    method : 'DELETE',
                    headers : {
                        "X-CSRFToken": csrftoken,
                        "Content-Type": "application/json; charset=UTF-8"                        
                    },
                };
                
                if (json.length > 0) {
                    json.forEach(async element => {
                        if (element.order == e.target.dataset.url){
                            response = await fetch(element.url,options);
                        }
                        
                    });
                }

                setTimeout(async () => {
                    response = await fetch(e.target.dataset.url, options);                    
                }, 50);

                if(!response.ok) throw {status : response.status, statusText : response.statusText};

                window.alert("Operación Exitosa");
                location.reload();

            } catch (error) {
                window.alert(`Error ${error.status}: ${error.message}`);
            }
        }                
    }

    //CERRAR MODAL DE ORDENES
    if (e.target === $orderSpan || e.target === $orderModal || e.target.matches(".btnCancelOrderModal")){
        $orderModal.style.display = "none";
        $orderForm.idOrder.value = null;
        $orderForm.idOrder.disabled = false;
        $orderForm.dateOrder.value = null;
        $orderForm.dateOrder.disabled = true;
        $orderForm.urlOrder.value = null;
        $orderForm.querySelector("#orderTotal").textContent ="";
        $orderForm.querySelector(".orderDetails").innerHTML = "";
        usedProducts = [];
    }

    //BOTON DETALLE DE ORDEN Y READ DE TODOS LOS DETALLES Y PRODUCTOS DE UNA ORDEN
    if (e.target.matches(".btnOrderDetail")){
        try {
            let products = [];

            let response = await fetch("https://testserializer.herokuapp.com/requests/orderDetails/");
            let json = await response.json();

            if(!response.ok) throw {status: response.status, statusText: response.statusText}; 
            
            let orderDetails = [];

            json.forEach(element => {
                if (element.order === e.target.dataset.url) {
                    orderDetails.push(element); 
                    usedProducts.push(element.product);
                }
            });
            
            orderDetails.forEach(async element => {
                response = await fetch(element.product);                
                if(!response.ok) throw {status: response.status, statusText: response.statusText};

                product = await response.json();
                products.push(product);      
            });

            setTimeout(() => {
                orderDetails.forEach(element => {
                    $orderDetailTemplate.querySelector(".cuantity").value = element.cuantity;
                    $orderDetailTemplate.querySelector(".price").value = element.price;
                    $orderDetailTemplate.querySelector(".idOrderDetail").value = element.id;
                    $orderDetailTemplate.querySelector(".urlOrderDetail").value = element.url;
                    $orderDetailTemplate.querySelector(".btnDeleteOrderDetail").dataset.url = element.url;

                    products.forEach(product => {
                        console.log("url element", element.product);
                        console.log("url producto", product.url);
                        if(element.product == product.url){
                            $orderDetailTemplate.querySelector(".product").value = product.name;
                            $orderDetailTemplate.querySelector(".product-price").value = product.price;
                        }
                    });    
    
                    let $clone = document.importNode($orderDetailTemplate, true);
                    $orderDetailFragment.appendChild($clone);
                });

                $orderForm.querySelector(".orderDetails").appendChild($orderDetailFragment);

                const $inputs = $orderForm.querySelectorAll('input[type="text"]');
                $inputs.forEach(element => {
                    element.setAttribute("disabled", true);    
                });

                $orderForm.querySelector('input[type="submit"]').setAttribute("disabled", true);
                $orderForm.querySelector(".btnEditOrder").disabled = false;
                $orderForm.querySelector(".btnDeleteOrder").disabled = false;

                $orderCrudTittle.textContent = "Orden";
                $orderForm.querySelector(".btnAddProductOrder").dataset.urlOrden = e.target.dataset.url;
                $orderForm.idOrder.value = e.target.dataset.id;
                $orderForm.dateOrder.valueAsNumber = Date.parse(e.target.dataset.date);
                $orderForm.querySelector("#orderTotal").textContent = e.target.dataset.total;
                $orderForm.urlOrder.value = e.target.dataset.url;
                $orderForm.querySelector(".btnDeleteOrder").dataset.url = e.target.dataset.url;
                $orderModal.style.display = "block";
                $orderCrudTittle.innerHTML = "Detalles de la Orden";
                $orderForm.querySelector(".btnAddProductOrder"). disabled = false;

            }, 50);
            
        } catch (error) {
            let message = error.statusText || 'Ocurrio un error';
            $orderForm.querySelector(".orderDetails").insertAdjacentHTML("afterend",`<p><b>Error ${error.status}: ${message}</b></p>`);
        }   
    }

    //BOTON AGREGAR ORDEN
    if (e.target.matches("#btn-add-order")){
        $orderForm.idOrder.disabled = true;
        $orderForm.querySelector(".btnEditOrder").disabled = true;
        $orderForm.querySelector(".btnDeleteOrder").disabled = true;
        $orderForm.querySelector('input[type="submit"]').disabled = false;
        $orderForm.querySelector(".btnAddProductOrder"). disabled = true;
        $orderForm.dateOrder.disabled = false;
        $orderModal.style.display = "block";
        $orderCrudTittle.innerHTML = "Agregar Orden";
    }

    //BOTON BORRAR ORDEN
    if(e.target.matches(".btnDeleteOrder")){
        $btnDeleteConfirm.dataset.mode = 'order';
        $btnDeleteConfirm.dataset.url = e.target.dataset.url;
        $deleteModalTittle.textContent = "Eliminar orden";
        $deleteModalQuestion.textContent = "Deseas eliminar la orden seleccionada y sus detalles?";
        $deleteModal.style.display = "block";
    }    

    //BOTON EDITAR ORDEN
    if(e.target.matches(".btnEditOrder")){
        $orderForm.querySelector('input[type="submit"]').disabled = false;
        $orderForm.dateOrder.disabled = false;
    }

    //BOTON BORRAR DETALLE DE ORDEN
    if(e.target.matches(".btnDeleteOrderDetail")){
        $btnDeleteConfirm.dataset.mode = 'single';
        $btnDeleteConfirm.dataset.url = e.target.dataset.url;
        $deleteModalTittle.textContent = "Eliminar detalle de orden";
        $deleteModalQuestion.textContent = "Deseas eliminar el detalle seleccionado?";
        $deleteModal.style.display = "block";
    }

    //CERRAR MODAL DE AGREGAR DETALLES
    if (e.target === $addDetailSpan || e.target === $addDetailModal || e.target.matches(".btnCancelAddDetailOrder")){
        $addDetailForm.urlOrder.value = null;
        $addDetailForm.idOrderDetail.value = null;
        $addDetailForm.cuantity.value = null;
        $addDetailForm.productName.value = null;
        $addDetailForm.urlOrderDetail.value = null;
        $addDetailModal.style.display = "none";
    }

    //BOTON AGREGAR PRODUCTO A DETALLE DE ORDEN
    if(e.target.matches(".btnAddProductOrder")){
        $addDetailForm.urlOrder.value = e.target.dataset.urlOrden;
        $addDetailModal.style.display = "block";
    }
});