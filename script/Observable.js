/**
 * @description
 * @param {any} init
 * @class
 */
export const Observable = function (init) {
    /**
     * @private
     */
    this.value = init;
    this.get = () => this.value;
    this.set = (newValue) => {
        this.value = newValue;
        this.listeners.forEach((listener) => {
            listener(this.value);
        });
    };
    /**
     * @type {((newValue :any)=> void)[]}
     */
    this.listeners = [];
    /**
     *
     * @param {(newValue :any)=> void} listener
     * @returns
     */
    this.addChangeListener = (listener) => this.listeners.push(listener);
};
