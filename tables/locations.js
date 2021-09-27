const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("data.db");

class Locations {
    constructor(database) {
        this.database = database;
        this.database.serialize(() => {
            this.database.run(`
            CREATE TABLE IF NOT EXISTS Locations(
                id INTEGER PRIMARY KEY,
                name VARCHAR(255),
                company INTEGER,
                manager VARCHAR(255)
            )`);
        });
    }
    add(location, company, manager) {
        this.database.serialize(() => {
            this.database.run(`
            INSERT INTO Locations(name,company, manager)
            VALUES ((?), (SELECT id FROM Companies WHERE name = (?)), (?))`,
                [location, company, manager]);
        });
    }
    remove(id) {
        this.database.serialize(() => {
            this.database.run(`
            DELETE FROM Locations WHERE id = (?)`,
                [id]);
        });
    }
}

module.exports = Locations;