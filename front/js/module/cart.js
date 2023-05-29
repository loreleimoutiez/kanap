const cartItemsContainer = document.querySelector("#cart__items");

function updateTotal() {
    const quantityDisplay = document.querySelector("#totalQuantity");
    if (quantityDisplay) {
        quantityDisplay.textContent = window.cart.totalQuantity;
    }

    const priceDisplay = document.querySelector(".cart__price #total-price");
    if (priceDisplay) {
        priceDisplay.textContent = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(window.cart.totalPrice);
    }
}

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

window.cart.items.forEach(cartItem => {
    const { product, quantity } = cartItem;

    let itemQuantityInput = document.createElement("input");
    itemQuantityInput.type = "number";
    itemQuantityInput.classList.add("itemQuantity");
    itemQuantityInput.name = "itemQuantity";
    itemQuantityInput.min = "1";
    itemQuantityInput.max = "100";
    itemQuantityInput.value = quantity;

    itemQuantityInput.addEventListener("input", () => {
        let quantity = parseInt(itemQuantityInput.value);
        window.cart.changeQuantity(product, quantity);

        updateTotal();
    });

    let row = document.createElement("article");
    row.classList.add("cart__item");
    row.dataset.id = product.id;
    row.dataset.color = product.color;

    let imgDiv = document.createElement("div");
    imgDiv.classList.add("cart__item__img");

    let img = document.createElement("img");
    img.src = product.image;
    img.alt = product.imageAlt;

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
        window.cart.removeProduct(product);
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

    updateTotal();
});

const formElement = document.querySelector('.cart__order__form');
formElement.addEventListener('submit', function (event) {
    event.preventDefault();

    // Vérifier les données saisies
    const isValid =
        validateInput(document.getElementById('firstName'), /^[a-zA-Z]+$/, document.getElementById('firstNameErrorMsg'), 'Le prénom doit contenir uniquement des lettres.') &&
        validateInput(document.getElementById('lastName'), /^[a-zA-Z]+$/, document.getElementById('lastNameErrorMsg'), 'Le nom doit contenir uniquement des lettres.') &&
        validateInput(document.getElementById('address'), /^[a-zA-Z0-9\s]+$/, document.getElementById('addressErrorMsg'), 'L\'adresse doit contenir uniquement des lettres, des chiffres et des espaces.') &&
        validateInput(document.getElementById('city'), /^[a-zA-Z]+$/, document.getElementById('cityErrorMsg'), 'La ville doit contenir uniquement des lettres.') &&
        validateInput(document.getElementById('email'), /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, document.getElementById('emailErrorMsg'), 'L\'adresse email n\'est pas valide.');

    // Si toutes les données sont valides, envoyer le formulaire
    if (isValid) {
        if (window.cart.items.length === 0) {
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
                products: window.cart.productIds
            })
        })
            .then(response => response.json())
            .then(data => {
                // Redirection vers la page de confirmation avec l'ID de commande
                localStorage.setItem("orderId", data.orderId);
                window.location.href = `confirmation.html?id=${data.orderId}`;

                // supprimer les produits du local storage
                window.cart.clear();
            })
            .catch(error => {
                // Gestion des erreurs
                console.error('Erreur:', error);
            });
    }
});
