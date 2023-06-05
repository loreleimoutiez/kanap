class ProductCard extends HTMLElement {
    connectedCallback() {
        this.innerHTML = this.render();
    }

    get identifier() {
        return this.getAttribute('identifier');
    }

    get image() {
        return this.getAttribute('image');
    }

    get alt() {
        return this.getAttribute('alt');
    }

    get title() {
        return this.getAttribute('title');
    }

    get description() {
        return this.getAttribute('description');
    }

    render() {
        return `
            <article class="product-card">
                <a class="product-link" href="/front/html/product.html?id=${this.identifier}">
                    <img class="product-image" src="${this.image}" alt="${this.alt}">
                    <h3 class="product-title">${this.title}</h3>
                    <p class="product-description">${this.description}</p>
                </a>
            </article>
        `;
    }
}

window.customElements.define('product-card', ProductCard);
