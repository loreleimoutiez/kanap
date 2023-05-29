let itemQuantityInput;

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
    // Convertir les produits du panier en tableau JavaScript
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
    // parseInt() permet de convertir une chaîne de caractères en un entier.
    if (quantity === "" || parseInt(quantity) <= 0 || parseInt(quantity) > 100) {
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
        if (newQuantity === "" || newQuantity < 1 || newQuantity > 100) {
            window.alert("Veuillez entrer une quantité valide entre 1 et 100.");
            return;
        }

        foundProduct.quantity = parseInt(newQuantity);
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

// get the DOM element for the cart items container
let cartItemsContainer = document.querySelector("#cart__items");

// vérifier si l'élément existe avant d'ajouter les éléments du panier
if (cartItemsContainer) {

    // loop over each product in the cart and generate the HTML markup for the table row
    cart.forEach(product => {
        itemQuantityInput = document.createElement("input");
        itemQuantityInput.type = "number";
        itemQuantityInput.classList.add("itemQuantity");
        itemQuantityInput.name = "itemQuantity";
        itemQuantityInput.min = "1";
        itemQuantityInput.max = "100";
        itemQuantityInput.value = product.quantity;

        itemQuantityInput.addEventListener("input", () => {
            let quantity = parseInt(itemQuantityInput.value);
            if (quantity >= 1 && quantity <= 100) {
                changeQuantity(product, quantity);
            } else {
                window.alert("Veuillez choisir une quantité entre 1 et 100.");
            }
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
}

let products = cart;

// update the total quantity and price
updateTotal();

// FORMULAIRE 

// Fonction de vérification des données saisies
function validateInput(inputElement, regex, errorMsgElement, errorMsg) {
    if (!regex.test(inputElement.value)) {
        errorMsgElement.textContent = errorMsg;
        errorMsgElement.style.color = 'red';
        errorMsgElement.style.fontWeight = 'bold';
        return false;
    } else {
        errorMsgElement.textContent = '';
        return true;
    }
}

// Écouteurs d'événement pour les champs de formulaire
let firstNameElement = document.getElementById('firstName');
if (firstNameElement !== null) {
    firstNameElement.addEventListener('input', function () {
        let regex = /^[a-zA-Z]+$/;
        let errorMsg = 'Le prénom doit contenir uniquement des lettres.';
        validateInput(this, regex, document.getElementById('firstNameErrorMsg'), errorMsg);
    });
}

let lastNameElement = document.getElementById('lastName');
if (lastNameElement !== null) {
    lastNameElement.addEventListener('input', function () {
        let regex = /^[a-zA-Z]+$/;
        let errorMsg = 'Le nom doit contenir uniquement des lettres.';
        validateInput(this, regex, document.getElementById('lastNameErrorMsg'), errorMsg);
    });
}

let addressElement = document.getElementById('address');
if (addressElement !== null) {
    addressElement.addEventListener('input', function () {
        let regex = /^[a-zA-Z0-9\s]+$/;
        let errorMsg = 'L\'adresse doit contenir uniquement des lettres, des chiffres et des espaces.';
        validateInput(this, regex, document.getElementById('addressErrorMsg'), errorMsg);
    });
}

let cityElement = document.getElementById('city');
if (cityElement !== null) {
    cityElement.addEventListener('input', function () {
        let regex = /^[a-zA-Z]+$/;
        let errorMsg = 'La ville doit contenir uniquement des lettres.';
        validateInput(this, regex, document.getElementById('cityErrorMsg'), errorMsg);
    });
}

let emailElement = document.getElementById('email');
if (emailElement !== null) {
    emailElement.addEventListener('input', function () {
        let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        let errorMsg = 'L\'adresse email n\'est pas valide.';
        validateInput(this, regex, document.getElementById('emailErrorMsg'), errorMsg);
    });
}

// Événement de soumission du formulaire
let formElement = document.querySelector('.cart__order__form');
if (formElement !== null) {
    formElement.addEventListener('submit', function (event) {
        event.preventDefault(); // Empêcher l'envoi du formulaire

        let product = getProductFromLocalStorage();
        if (product == null) {
            console.log("Le produit n'est pas trouvé dans le local storage.");
            return;
        }

        let idProducts = [];

        console.log("products = " + products);

        products.forEach((product) => {
            idProducts.push(product._id)
        })

        // Vérifier les données saisies
        let isValid =
            validateInput(document.getElementById('firstName'), /^[a-zA-Z]+$/, document.getElementById('firstNameErrorMsg'), 'Le prénom doit contenir uniquement des lettres.') &&
            validateInput(document.getElementById('lastName'), /^[a-zA-Z]+$/, document.getElementById('lastNameErrorMsg'), 'Le nom doit contenir uniquement des lettres.') &&
            validateInput(document.getElementById('address'), /^[a-zA-Z0-9\s]+$/, document.getElementById('addressErrorMsg'), 'L\'adresse doit contenir uniquement des lettres, des chiffres et des espaces.') &&
            validateInput(document.getElementById('city'), /^[a-zA-Z]+$/, document.getElementById('cityErrorMsg'), 'La ville doit contenir uniquement des lettres.') &&
            validateInput(document.getElementById('email'), /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, document.getElementById('emailErrorMsg'), 'L\'adresse email n\'est pas valide.');

        // Si toutes les données sont valides, envoyer le formulaire
        if (isValid) {
            if (products.length === 0) {
                console.log("Le panier est vide.");
                return;
            }

            document.getElementById('order').value = 'En cours...';
            document.getElementById('order').disabled = true;

            // Envoyer l'objet contact au serveur
            fetch(`http://localhost:3000/api/products/order`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Origin': 'http://127.0.0.1:5501/front/html/cart.html'
                },
                body: JSON.stringify({
                    contact: {
                        firstName: document.querySelector('[name="firstName"]').value,
                        lastName: document.querySelector('[name="lastName"]').value,
                        address: document.querySelector('[name="address"]').value,
                        city: document.querySelector('[name="city"]').value,
                        email: document.querySelector('[name="email"]').value
                    },
                    products: idProducts
                })
            })
                .then(response => response.json())
                .then(data => {
                    // Redirection vers la page de confirmation avec l'ID de commande
                    localStorage.setItem("orderId", data.orderId);
                    const orderId = data.orderId;
                    const confirmationUrl = `confirmation.html?id=${orderId}`;
                    window.location.href = confirmationUrl;
                    // console.log('log de data = ' + JSON.stringify(data));

                    // supprimer les produits du local storage
                    localStorage.removeItem("cart");
                })
                .catch(error => {
                    // Gestion des erreurs
                    console.error('Erreur:', error);
                });
        }
    });
}