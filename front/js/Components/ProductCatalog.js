class ProductCatalog extends HTMLElement {

    get apiUrl() {
        return this.getAttribute('api-url');
    }

    connectedCallback() {
        fetch(this.apiUrl, {
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
            })
            .then(jsonResponse => {
                if (typeof jsonResponse !== 'object') {
                    throw new Error('Response is not a valid JSON');
                }

                this.innerHTML = this.render(jsonResponse);
            })
            .catch(error => {
                console.log('Error:', error.message);
            });
    }

    render(products) {
        return `
            <section class="items" id="items">
                ${products.map(product => {
            return `
                            <product-card 
                                identifier="${product._id}"
                                title="${product.name}"
                                description="${product.description}"
                                image="${product.imageUrl}"
                                alt="${product.altTxt}"
                            >
                            </product-card>
                        `;
        }).join('')
            }
            </section>
        `;
    }
}

window.customElements.define('product-catalog', ProductCatalog);
