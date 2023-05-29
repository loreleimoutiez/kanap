import LocalStoragePersister from "./LocalStoragePersister.js";

export default class Cart extends LocalStoragePersister {
    constructor() {
        super('KANAP_CART');

        this.items = this.get([]);
    }

    addProduct(product, quantity = 1) {
        if (isNaN(quantity) || quantity <= 0) {
            return window.alert("Veuillez entrer une quantité valide entre 1 et 100.");
        }

        const hasAlreadyItem = this.items.find(cartItem => cartItem.product.id === product.id);

        if (hasAlreadyItem) {
            hasAlreadyItem.quantity += quantity;
        } else {
            this.items.push({ product, quantity });
        }

        this.save(this.items);
    }

    changeQuantity(product, newQuantity) {
        if (isNaN(newQuantity) || newQuantity <= 0) {
            return window.alert("Veuillez entrer une quantité valide entre 1 et 100.");
        }

        const hasAlreadyItem = this.items.find(cartItem => cartItem.product.id === product.id);
        if (hasAlreadyItem) {
            hasAlreadyItem.quantity = newQuantity;
        }

        this.save(this.items);
    }

    removeProduct(product) {
        const index = this.items.findIndex(cartItem => cartItem.product.id === product.id);
        // const index = this.items.findIndex(({ product }) => product._id === productId);

        if (-1 !== index) {
            this.items.splice(index, 1);
        }

        this.save(this.items);
    }

    clear() {
        this.items = [];
        this.remove();
    }

    get totalQuantity() {
        return this.items.reduce((totalQuantity, cartItem) => {
            totalQuantity += cartItem.quantity;

            return totalQuantity;
        }, 0);
    }

    get totalPrice() {
        return this.items.reduce((totalPrice, cartItem) => {
            totalPrice += (cartItem.product.price * cartItem.quantity);

            return totalPrice;
        }, 0);
    }

    get productIds() {
        return this.items.map(cartItem => cartItem.product.id);
    }
}
