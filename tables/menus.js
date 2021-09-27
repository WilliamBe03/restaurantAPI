const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("data.db");

class Menus {
    constructor(database) {
        this.database = database;
        this.database.serialize(() => {
            this.database.run(`
            CREATE TABLE IF NOT EXISTS Menus(
                id INTEGER PRIMARY KEY,
                title VARCHAR(255),
                company INTEGER
            )`);
        });
    }
    add(title, company) {
        this.database.serialize(() => {
            this.database.run(`
            INSERT INTO Menus(title, company)
            VALUES ((?), (SELECT id FROM Companies WHERE name = (?)))`,
                [title, company]);
        });
    }
    remove(id) {
        this.database.serialize(() => {
            this.database.run(`
            DELETE FROM Menu WHERE id = (?)`,
                [id]);
        });
    }
}

module.exports = Menus;