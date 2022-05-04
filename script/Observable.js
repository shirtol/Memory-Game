/**
 * @description
 * @class
 * @param {any} init
 */
export class Observable {
    get value() {
        return this._value;
    }

    set value(newValue) {
        this._value = newValue;
        this.listeners.forEach((listener) => {
            listener(this._value);
        });
    }

    /**
     *
     * @param {*} init
     */
    constructor(init) {
        /**
         * @private
         */
        this._value = init;
        /**
         * @type {((newValue :any)=> void)[]}
         */
        this.get = () => this.value;
        this.set = (newValue) => {
            this.value = newValue;
            this.listeners.forEach((listener) => {
                listener(this.value);
            });
        };
        this.listeners = [];
        /**
         *
         * @param {(newValue :any)=> void} listener
         * @returns
         */
        this.addChangeListener = (listener) => this.listeners.push(listener);
    }
}
