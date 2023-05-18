document.addEventListener("DOMContentLoaded", () => {
    updateTotal();
});

let product = JSON.parse(localStorage.getItem('productDetails'));
let quantityInput = document.querySelector("#quantity");

function updateTotal() {
    let totalQuantity = getNumberProduct();
    let totalPrice = getTotalPrice();

    let quantityDisplay = document.querySelector("#totalQuantity");
    if (quantityDisplay) {
        quantityDisplay.textContent = totalQuantity;
    }

    let priceDisplay = document.querySelector(".cart__price #total-price");
    if (priceDisplay) {
        priceDisplay.textContent = totalPrice;
    }
}

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

function addCart(quantity) {
    let color = getSelectedColor();
    let product = getProductFromLocalStorage();

    if (product == null) {
        console.log("Le produit n'est pas trouvé dans le local storage.");
        return;
    }

    if (color === "") {
        window.alert("Veuillez sélectionner une couleur.");
        return;
    }

    if (quantity == null || quantity === "" || quantity < 1 || quantity > 100) {
        window.alert("Veuillez entrer une quantité valide entre 1 et 100.");
        return;
    }

    let cart = getCart();
    let foundProduct = cart.find(p => p.id === product.id && p.color === color);
    if (foundProduct != undefined) {
        foundProduct.quantity += parseInt(quantity);
    } else {
        product.color = color;
        product.quantity = parseInt(quantity);
        cart.push(product);
    }

    saveCart(cart);
    updateTotal();
}

function getProductFromLocalStorage() {
    let productJSON = localStorage.getItem('productDetails');
    return productJSON ? JSON.parse(productJSON) : null;
}

function getSelectedColor() {
    let colorSelect = document.querySelector('#colors');
    return colorSelect.value;
}

function removeFromCart(product) {
    let cart = getCart();
    let productIndex = cart.findIndex(p => p.id === product.id);
    if (productIndex !== -1) {
        cart.splice(productIndex, 1);
        let totalPrice = 0;
        for (let i = 0; i < cart.length; i++) {
            totalPrice += cart[i].price;
        }
        saveCart(cart, totalPrice);
    }
    updateTotal();
}

function changeQuantity(product, newQuantity) {
    let cart = getCart();
    let foundProduct = cart.find(p => p.id == product.id && p.color == product.color);
    if (foundProduct != undefined) {
        foundProduct.quantity = newQuantity;
        if (foundProduct.quantity <= 0) {
            removeFromCart(foundProduct);
        } else {
            // update the quantity input
            let row = document.querySelector(`[data-id="${product.id}"][data-color="${product.color}"]`);
            let quantityInput = row.querySelector(".itemQuantity");
            quantityInput.value = foundProduct.quantity;
            saveCart(cart);
        }
    }
    // update the total price
    updateTotal();
}

function getNumberProduct() {
    let cart = getCart();
    let totalQuantity = 0;
    cart.forEach(function (product) {
        totalQuantity += product.quantity;
    });
    return totalQuantity;
}

function getTotalPrice() {
    let cart = getCart();
    let total = 0;

    for (let product of cart) {
        total += product.quantity * product.price;
    }

    return total;
}

// get the cart data from local storage
let cart = getCart();

/// get the DOM element for the cart items container
let cartItemsContainer = document.querySelector("#cart__items");

// loop over each product in the cart and generate the HTML markup for the table row
cart.forEach(product => {
    let itemQuantityInput = document.createElement("input");
    itemQuantityInput.type = "number";
    itemQuantityInput.classList.add("itemQuantity");
    itemQuantityInput.name = "itemQuantity";
    itemQuantityInput.min = "1";
    itemQuantityInput.max = "100";
    itemQuantityInput.value = product.quantity;

    itemQuantityInput.addEventListener("input", () => {
        changeQuantity(product, parseInt(itemQuantityInput.value));
    });

    let row = document.createElement("article");
    row.classList.add("cart__item");
    row.dataset.id = product.id;
    row.dataset.color = product.color;

    let imgDiv = document.createElement("div");
    imgDiv.classList.add("cart__item__img");

    let img = document.createElement("img");
    img.src = product.imageUrl;
    img.alt = product.name;

    imgDiv.appendChild(img);

    let contentDiv = document.createElement("div");
    contentDiv.classList.add("cart__item__content");

    let descriptionDiv = document.createElement("div");
    descriptionDiv.classList.add("cart__item__content__description");

    let name = document.createElement("h2");
    name.textContent = product.name;

    let color = document.createElement("p");
    color.textContent = product.color;

    let price = document.createElement("p");
    price.textContent = product.price + " €";

    descriptionDiv.appendChild(name);
    descriptionDiv.appendChild(color);
    descriptionDiv.appendChild(price);

    let settingsDiv = document.createElement("div");
    settingsDiv.classList.add("cart__item__content__settings");

    let quantityDiv = document.createElement("div");
    quantityDiv.classList.add("cart__item__content__settings__quantity");

    let quantityLabel = document.createElement("p");
    quantityLabel.textContent = "Qté : ";

    quantityDiv.appendChild(quantityLabel);
    quantityDiv.appendChild(itemQuantityInput);

    let deleteDiv = document.createElement("div");
    deleteDiv.classList.add("cart__item__content__settings__delete");

    let deleteLink = document.createElement("p");
    deleteLink.classList.add("deleteItem");
    deleteLink.textContent = "Supprimer";
    deleteLink.addEventListener("click", () => {
        removeFromCart(product);
        row.remove();
        updateTotal();
    });

    deleteDiv.appendChild(deleteLink);

    settingsDiv.appendChild(quantityDiv);
    settingsDiv.appendChild(deleteDiv);

    contentDiv.appendChild(descriptionDiv);
    contentDiv.appendChild(settingsDiv);

    row.appendChild(imgDiv);
    row.appendChild(contentDiv);

    cartItemsContainer.appendChild(row);
});

// update the total quantity and price
updateTotal();