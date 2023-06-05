class ItemCard extends HTMLElement {
  connectedCallback() {
    this.innerHTML = this.render();
    document.title = this.title;

    const colors = this.colors;
    const select = document.querySelector('#colors');

    for (let i = 0; i < colors.length; i++) {
      const option = document.createElement('option');
      option.text = colors[i];
      option.value = colors[i];
      select.insertAdjacentElement('beforeend', option);
    }
  }

  get image() {
    return this.getAttribute('image');
  }

  get alt() {
    return this.getAttribute('alt');
  }

  get price() {
    return this.getAttribute('price');
  }

  get title() {
    return this.getAttribute('title');
  }

  get description() {
    return this.getAttribute('description');
  }

  get form() {
    return this.getAttribute('form');
  }

  get colors() {
    const colorsString = this.getAttribute('colors');
    return colorsString.split(',');
  }

  render() {
    return `
        <article class="item-card">
        <article>
        <div class="item__img">
          <img class="product_img" src="${this.image}" alt="${this.alt}">
        </div>
        <div class="item__content">

          <div class="item__content__titlePrice">
            <h1 id="title">${this.title}</h1>
            <p>Prix : <span id="price">${this.price}</span>€</p>
          </div>

          <div class="item__content__description">
            <p class="item__content__description__title">Description :</p>
            <p id="description">${this.description}</p>
          </div>

          <form id="add-product">
            <div class="item__content__settings">
              <div class="item__content__settings__color">
                <label for="colors">Choisir une couleur :</label>
                <select name="color" id="colors" required>
                  <option value="">--SVP, choisissez une couleur --</option>
                </select>
              </div>

              <div class="item__content__settings__quantity">
                <label for="quantity">Nombre d'article(s) (1-100) :</label>
                <input type="number" name="quantity" min="1" max="100" step="1" value="1" id="quantity" required>
              </div>
            </div>

            <div class="item__content__addButton">
              <button id="add-to-cart" type="submit">Ajouter au
                panier</button>
            </div>
          </form>

        </div>
      </article> 
            
        </article>
        `
  }

}

window.customElements.define('item-card', ItemCard);