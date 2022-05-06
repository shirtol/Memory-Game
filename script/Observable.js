/**
 * @description observe changes, run all given callbacks for a given element when changed
 * @type {Observable}
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
         * @private
         * @type {((newValue :any)=> void)[]}
         */
        this.listeners = [];
        /**
         *
         * @param {(newValue :any)=> void} listener
         * @returns
         */
        this.addChangeListener = (listener) => this.listeners.push(listener);
        this.removeChangeListener = (listener) =>
            this.listeners.splice(this.listeners.indexOf(listener), 1);
        this.nukeListeners = () => (this.listeners = []);
    }
}
