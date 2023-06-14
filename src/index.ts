interface Pokemon {
  id: string;
  attack: number;
  defense: number;
}

interface BaseRecord {
  id: string;
}

interface Database<T extends BaseRecord> {
  set(newValue: T): void;
  get(id: string): T | undefined;
}

// Factory Pattern
function createDatabase<T extends BaseRecord>() {
  class InMemoryDatabase implements Database<T> {
    private db: Record<string, T> = {};

    static instance: InMemoryDatabase = new InMemoryDatabase();

    private constructor() {}

    public set(newValue: T): void {
      this.db[newValue.id] = newValue;
    }
    public get(id: string): T | undefined {
      return this.db[id];
    }
  }
  // Singleton
  // const db = new InMemoryDatabase();
  // return db;
  return InMemoryDatabase.instance;
}

const pokemonDB = createDatabase<Pokemon>();
pokemonDB.set({ id: "Bulbasour", attack: 50, defense: 10 });

console.log(pokemonDB.get("Bulbasour"));
