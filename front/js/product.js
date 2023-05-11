// Extract the id parameter from the URL
const searchParams = new URLSearchParams(window.location.search)
const id = searchParams.get('id')

// Select the necessary DOM elements
const img = document.querySelector('.product_img');
const productName = document.querySelector('#title');
const productPrice = document.querySelector('#price');
const productDescription = document.querySelector('#description');
const productColors = document.querySelector('#colors');

function renderProductDetails(product) {
    img.src = product.imageUrl;
    img.setAttribute('alt', product.altTxt);
    productName.textContent = product.name;
    productPrice.textContent = `${product.price} `;
    productDescription.textContent = product.description;
}

let productDetails;

fetch(`http://localhost:3000/api/products/${id}`, {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
})
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Request failed');
    }, networkError => {
        console.log(networkError.message);
    })
    .then(jsonResponse => {
        if (typeof jsonResponse !== 'object') {
            throw new Error('Response is not a valid JSON');
        }
        renderProductDetails(jsonResponse);
        // Set the product name as the title of the page
        document.title = jsonResponse.name;

        // Assign the product details to the global variable
        productDetails = jsonResponse;

        // Save the product details to local storage 
        localStorage.setItem('productDetails', JSON.stringify(jsonResponse));

        // Event listener for "Add to cart" button
        const addToCartBtn = document.querySelector('#add-to-cart');
        addToCartBtn.addEventListener('click', function () {
            // Get the product details from the global variable
            const product = productDetails;
            const quantityInput = document.querySelector("#quantity");
            const quantity = quantityInput.value;
            addCart(quantity);
        });


        /**
         * This code retrieves colors from the JSON to generate the code that allows selecting the colors of a product based on the product clicked on the homepage
         * 
         * The variable colors contains an array of colors returned by the API in the JSON format
         * jsonResponse is a variable that contains the JSON response from the API
         */
        const colors = jsonResponse.colors;
        const select = document.querySelector('#colors');

        // This for loop iterates through each element of the colors array
        for (let i = 0; i < colors.length; i++) {
            // For each element of colors, a new HTML option element is created for the dropdown list
            const option = document.createElement('option');
            // The value associated with each option is set as the corresponding color from the colors array, 
            // and then each new option is added to the end of the dropdown list (or select), using the insertAdjacentElement() method.
            option.text = colors[i];
            option.value = colors[i];
            select.insertAdjacentElement('beforeend', option);
        }
    })
    .catch(error => {
        console.log('Error:', error.message);
    });