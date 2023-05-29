export default class LocalStoragePersister {
    constructor(key) {
        this.key = key;
    }

    save(value) {
        window.localStorage.setItem(this.key, JSON.stringify(value));
    }

    remove() {
        window.localStorage.removeItem(this.key);
    }

    get(defaultValue = null) {
        const value = window.localStorage.getItem(this.key);
        if (null !== value) {
            return JSON.parse(value);
        }

        return defaultValue;
    }
}
