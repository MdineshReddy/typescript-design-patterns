"use strict";
function createObserver() {
    let listeners = [];
    return {
        subscribe: (listener) => {
            listeners.push(listener);
            return () => {
                listeners = listeners.filter((l) => l !== listener);
            };
        },
        publish(event) {
            listeners.forEach((l) => l(event));
        },
    };
}
// Factory Pattern
function createDatabase() {
    class InMemoryDatabase {
        constructor() {
            this.db = {};
            this.beforeAddListeners = createObserver();
            this.afterAddListeners = createObserver();
        }
        set(newValue) {
            this.beforeAddListeners.publish({
                newValue,
                value: this.db[newValue.id],
            });
            this.db[newValue.id] = newValue;
            this.afterAddListeners.publish({
                value: newValue,
            });
        }
        get(id) {
            return this.db[id];
        }
        onBeforeAdd(listener) {
            return this.beforeAddListeners.subscribe(listener);
        }
        onAfterAdd(listener) {
            return this.afterAddListeners.subscribe(listener);
        }
        //visitor
        visit(visitor) {
            Object.values(this.db).forEach(visitor);
        }
    }
    InMemoryDatabase.instance = new InMemoryDatabase();
    return InMemoryDatabase.instance;
}
const pokemonDB = createDatabase();
const unsubscribe = pokemonDB.onAfterAdd(({ value }) => console.log(value));
pokemonDB.set({ id: "Bulbasour", attack: 50, defense: 10 });
unsubscribe();
pokemonDB.set({ id: "Spinosaur", attack: 150, defense: 20 });
pokemonDB.visit((item) => {
    console.log(item.id);
});
