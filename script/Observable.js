/**
 * @description observe changes, run all given callbacks for a given element when changed
 * @class
 */
export class Observable {
    /**
     * @description return the value of the observable.
     * @type {any}
     */
    get value() {
        return this._value;
    }

    /**
     * @description change the value of the observable to a new one, and call all the listeners with the new value.
     * @param {any} newValue
     */
    set value(newValue) {
        this._value = newValue;
        this.listeners.forEach((listener) => {
            listener(this._value);
        });
    }

    /**
     * @param {any} init
     */
    constructor(init) {
        /**
         * @private
         * @type {any}
         */
        this._value = init;
        /**
         * @private
         * @type {((newValue :any)=> void)[]}
         */
        this.listeners = [];
        /**
         * @param {(newValue :any)=> void} listener
         * @returns
         */
        this.addChangeListener = (listener) => this.listeners.push(listener);
        /**
         * @description remove a single change listener
         * @param {(newValue :any)=> void} listener
         */
        this.removeChangeListener = (listener) =>
            this.listeners.splice(this.listeners.indexOf(listener), 1);
        /**
         * @description clear the entire array of listeners
         */
        this.nukeListeners = () => (this.listeners = []);
    }
}
