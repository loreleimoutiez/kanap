class ItemContainer extends HTMLElement {

    get apiUrl() {
        return this.getAttribute('api-url');
    }

    get idInUrl() {
        const searchParams = new URLSearchParams(window.location.search);
        const id = searchParams.get('id');
        return id;
    }

    connectedCallback() {

        fetch(`${this.apiUrl}/${this.idInUrl}`, {
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

                this.innerHTML = this.render(jsonResponse);

            })
            .catch(error => {
                console.log('Error:', error.message);
            });
    }

    render(products) {
        return `
            
                ${[products].map(product => {
            return `
                        <item-card
                            identifier="${product._id}"
                            title="${product.name}"
                            description="${product.description}"
                            image="${product.imageUrl}"
                            alt="${product.altTxt}"
                            price="${product.price}"
                            colors="${product.colors}"
                        >
                        </item-card>
                    `;
        })}
            
        `;
    }

}

window.customElements.define('item-container', ItemContainer);