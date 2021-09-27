const sqlite3 = require("sqlite3").verbose();
const express = require("express");
const Companies = require("./tables/companies");
const Locations = require("./tables/locations");
const Menus = require("./tables/menus");

const db = new sqlite3.Database("data.db");
const app = express();
const port = 4000;

const Company = new Companies(db);
const Location = new Locations(db);
const Menu = new Menus(db);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/companies", async (req, res) => {
    var ret = await db.all("SELECT * FROM Companies",
        [], (err, rows) => {
            if (err) {
                throw err;
            };
            res.send(rows);
        });
});

app.get("/companies/:id", async (req, res) => {
    var ret = await db.all("SELECT name, logoURL FROM Companies WHERE id = (?)",
        [req.params.id],
        (err, rows) => {
        if (err) {
            throw err;
        };
        res.send(rows);
    });
});

app.get("/companies/:id/menus", async (req, res) => {
    var ret = await db.all("SELECT title FROM Menus WHERE company = (?)",
        [req.params.id],
        (err, rows) => {
            if (err) {
                throw err;
            };
            res.send(rows);
        });
});

app.post("/companies", (req, res) => {
    Company.add(req.body.name, req.body.logo);
    res.send("Added!");
});

app.delete("/companies/:id", (req, res) => {
    Company.remove(req.params.id);
    res.send("Removed!")
});

app.put("companies/:id", (req, res) => {
    Company.update(req.params.id, req.body.name, req.body.logo)
    res.send("Updated!")
});

app.get("/menus", async (req, res) => {
    var ret = await db.all("SELECT * FROM Menus",
        [], (err, rows) => {
            if (err) {
                throw err;
            };
            res.send(rows)
        });
});

app.get("/menus/:id", async (req, res) => {
    var ret = await db.all("SELECT * FROM Menus WHERE id = (?)",
        [req.params.id], (err, rows) => {
            if (err) {
                throw err;
            };
            res.send(rows)
        });
});

app.post("/menus", (req, res) => {
    Menu.add(req.body.title, req.body.company);
    res.send("Added!");
});

app.delete("/menus/:id", (req, res) => {
    Menu.remove(req.params.id);
    res.send("Removed!")
});

app.get("/locations", async (req, res) => {
    var ret = await db.all("SELECT * FROM Locations",
        [], (err, rows) => {
            if (err) {
                throw err;
            };
            res.send(rows);
        });
});

app.get("/locations/:id", async (req, res) => {
    var ret = await db.all("SELECT * FROM Locations WHERE id = (?)",
        [req.params.id],
        (err, rows) => {
            if (err) {
                throw err;
            };
            res.send(rows);
        });
});

app.post("/locations", (req, res) => {
    Location.add(req.body.location, req.body.company, req.body.manager);
    res.send("Added!");
});

app.delete("/locations/:id", (req, res) => {
    Location.remove(req.params.id);
    res.send("Removed!");
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});