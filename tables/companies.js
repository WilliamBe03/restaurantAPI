const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("data.db");

class Companies {
    constructor(database) {
        this.database = database;
        this.database.serialize(() => {
            this.database.run(`
            CREATE TABLE IF NOT EXISTS Companies(
                id INTEGER PRIMARY KEY,
                name VARCHAR(255),
                logoURL VARCHAR(255))`);
        });
    }
    add(name, logo) {
        this.database.serialize(() => {
            this.database.run(`
                INSERT INTO Companies(name,logoURL)
                VALUES ((?),(?))`, [name, logo]);
        });
    }
    remove(id) {
        this.database.serialize(() => {
            this.database.run(`
            DELETE FROM Companies WHERE id = (?)`,
                [id]);
        });
    }
    update(id, name, logo) {
        this.database.serialize(() => {
            this.database.run(`
            UPDATE Companies
            SET name = (?), logoURL = (?)
            WHERE id = (?)`,
                [name, logo, id]);
        });
    }
}

module.exports = Companies;