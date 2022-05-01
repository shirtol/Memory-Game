/**
 * @description
 * @class
 * @param {any} init
 */
export const Observable = function (init) {
    this.value = init;
    this.get = () => this.value;
    this.set = (newValue) => {
        this.value = newValue;
        this.listeners.forEach((listener) => {
            listener(this.value);
        });
    };
    this.listeners = [];
    this.addChangeListener = (listener) => this.listeners.push(listener);
};
