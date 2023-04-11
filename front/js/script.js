// Selects page elements
const items = document.querySelector('#items');

/**
 * creates HTML elements dynamically to display a list of products fetched from a JSON response
 * @param {*} jsonResponse 
 * 
 * It creates an "article" element that contains an "a" element linking to a product detail page, 
 * an "img" element displaying the product image, a "h3" element displaying the product name and a "p" element displaying the product description. 
 * The elements are then appended to the main container.
 */
function renderResponse(products) {

    products.forEach((product) => {
        const article = document.createElement('article');
        const link = document.createElement('a');
        const img = document.createElement('img');
        const productName = document.createElement('h3');
        const productDescription = document.createElement('p');

        link.href = `./product.html?id=${product._id}`;
        img.src = product.imageUrl;
        img.setAttribute('alt', product.altTxt);
        productName.textContent = product.name;
        productDescription.textContent = product.description;

        link.appendChild(img);
        link.appendChild(productName);
        link.appendChild(productDescription);
        article.appendChild(link);
        items.appendChild(article);
    });
}

/**
 * Send custom request using fetch api
 * @param { String } url - L'URL de la ressource à laquelle la requête est envoyée
 * @param { Object } method - La méthode HTTP utilisée dans la requête
 * @param { Object } headers - Les en-têtes (headers) utilisés dans la requête, spécifiés sous forme d'objet clé/valeur
 * 
 * La promesse est résolue avec la réponse de la requête si elle réussit, et rejetée avec une erreur si elle échoue. 
 * Les méthodes .then() et .catch() sont utilisées pour gérer respectivement la résolution et le rejet de la promesse.
 * 
 */
fetch('http://localhost:3000/api/products', {
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
        console.log(networkError.message)
    })
    .then(jsonResponse => {
        if (typeof jsonResponse !== 'object') {
            throw new Error('Response is not a valid JSON');
        }
        renderResponse(jsonResponse);
    })
    .catch(error => {
        console.log('Error:', error.message);
    });