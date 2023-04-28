let product = JSON.parse(localStorage.getItem('productDetails'));
let quantityInput = document.querySelector("#quantity");

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function getCart() {
    let cart = localStorage.getItem("cart");
    if (cart == null) {
        return [];
    }
    return JSON.parse(cart);
}

function addCart() {
    // retrieve the product from local storage
    let productJSON = localStorage.getItem('productDetails');
    if (productJSON == null) {
        console.log("Le produit n'est pas trouvé dans le local storage.");
        return;
    }
    let product = JSON.parse(productJSON);

    let quantity = quantityInput.value;
    if (quantity == null || quantity == "") {
        console.log("Veuillez entrer une quantité valide.");
        return;
    }

    // get the selected color from the HTML element
    let colorSelect = document.querySelector('#colors');
    let color = colorSelect.value;

    // add the color property to the product
    product.color = color;

    let cart = getCart();
    let foundProduct = cart.find(p => p.id == product.id && p.color == color);
    if (foundProduct != undefined) {
        foundProduct.quantity = foundProduct.quantity + parseInt(quantity) - 1;
    } else {
        product.quantity = parseInt(quantity);
        cart.push(product);
    }

    saveCart(cart);
}

function removeFromCart(product) {
    let cart = getCart();
    cart = cart.filter(p => p.id != product.id);
    saveCart(cart);
}

function changeQuantity(product, quantity) {
    let cart = getCart();
    let foundProduct = cart.find(p => p.id == product.id);
    if (foundProduct != undefined) {
        foundProduct.quantity += quantity;
        if (foundProduct.quantity <= 0) {
            removeFromCart(foundProduct);
        } else {
            quantityInput.value = foundProduct.quantity;
            saveCart(cart);
        }
    }
}

function getNumberProduct() {
    let cart = getCart();
    let number = 0;

    for (let product of cart) {
        number += product.quantity;
    }
    return number;
}

function getTotalPrice() {
    let cart = getCart();
    let total = 0;

    for (let product of cart) {
        total += product.quantity * product.price;
    }
    return total;
}
