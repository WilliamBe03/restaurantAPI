const sqlite3 = require("sqlite3").verbose();
const express = require("express");
const Companies = require("./tables/companies");
const Locations = require("./tables/locations");
const Menus = require("./tables/menus");
const path = require("path");
const Handlebars = require("handlebars");
const expressHandlebars = require("express-handlebars");
const {
    allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");


const db = new sqlite3.Database("data.db");
const app = express();
const port = 4001;

const Company = new Companies(db);
const Location = new Locations(db);
const Menu = new Menus(db);

function dbAll(sql , p = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, p, (err, rows) => {
            if (err) {
                reject(err);
            }
            resolve(rows);
        });
    });
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const handlebars = expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
});
app.engine("handlebars", handlebars);
app.set("view engine", "handlebars");
app.set('views', path.join(__dirname, 'views'));

app.get("/", async (req, res) => {
    const companies = await dbAll("SELECT * FROM Companies");
    res.render("home", { companies });
});

app.get("/company/:id", async (req, res) => {
    const [company] = await dbAll("SELECT * FROM Companies WHERE id = (?)",
        [req.params.id]);
    res.render("company", { company });
});

app.get("/company/:id/menus", async (req, res) => {
    const menus = await dbAll("SELECT * FROM Menus WHERE company = (?)",
        [req.params.id]);
    const [company] = await dbAll("SELECT * FROM Companies WHERE id = (?)",
        [req.params.id]);
    res.render("menus", {menus, company})
})

app.get("/company/:id/locations", async (req, res) => {
    const locations = await dbAll("SELECT * FROM Locations WHERE company = (?)",
        [req.params.id]);
    const [company] = await dbAll("SELECT * FROM Companies WHERE id = (?)",
        [req.params.id]);
    res.render("locations", { locations, company });
})

app.get("/companies", async (req, res) => {
    await db.all("SELECT * FROM Companies",
        [], (err, rows) => {
            if (err) {
                throw err;
            };
            res.send(rows);
        });
});

app.get("/companies/:id", async (req, res) => {
    await db.all("SELECT name, logoURL FROM Companies WHERE id = (?)",
        [req.params.id],
        (err, rows) => {
        if (err) {
            throw err;
            };
            if (rows.length === 0) {
                res.sendStatus(404);
                return;
            }
            res.send(rows);
    });
});

app.get("/companies/:id/menus", async (req, res) => {
    await db.all("SELECT title FROM Menus WHERE company = (?)",
        [req.params.id],
        (err, rows) => {
            if (err) {
                throw err;
            };
            if (rows.length === 0) {
                res.sendStatus(404);
                return;
            }
            res.send(rows);
        });
});

app.get("/companies/:id/locations", async (req, res) => {
    await db.all("SELECT name, manager FROM Locations WHERE company = (?)",
        [req.params.id],
        (err, rows) => {
            if (err) {
                throw err;
            };
            if (rows.length === 0) {
                res.sendStatus(404);
                return;
            }
            res.send(rows);
        });
});

app.post("/companies", (req, res) => {
    const { name, logo } = req.body
    if (!name || !logo) {
        res.sendStatus(400)
        return
    }
    Company.add(req.body.name, req.body.logo);
    res.send("Added!");
});

app.delete("/companies/:id", async (req, res) => {
    await db.all("SELECT * FROM Companies WHERE id = (?)",
        [req.params.id], (err, rows) => {
            if (err) { throw err }
            if (rows.length === 0) {
                res.sendStatus(400);
                return
            }
            Company.remove(req.params.id);
            res.send("Removed!")
        });
});

app.put("companies/:id", (req, res) => {
    const { name, logo } = req.body
    if (!name || !logo) {
        res.sendStatus(400)
        return
    }
    Company.update(req.params.id, req.body.name, req.body.logo)
    res.send("Updated!")
});

app.get("/menus", async (req, res) => {
    await db.all("SELECT * FROM Menus",
        [], (err, rows) => {
            if (err) {
                throw err;
            };
            res.send(rows)
        });
});

app.get("/menus/:id", async (req, res) => {
    await db.all("SELECT * FROM Menus WHERE id = (?)",
        [req.params.id], (err, rows) => {
            if (err) {
                throw err;
            };
            if (rows.length === 0) {
                res.sendStatus(404);
                return;
            }
            res.send(rows)
        });
});

app.post("/menus", (req, res) => {
    const { title, company } = req.body
    if (!title || !company) {
        res.sendStatus(400);
        return
    }
    Menu.add(req.body.title, req.body.company);
    res.send("Added!");
});

app.delete("/menus/:id", async (req, res) => {
    await db.all("SELECT * FROM Menus WHERE id = (?)",
        [req.params.id], (err, rows) => {
            if (err) { throw err }
            if (rows.length === 0) {
                res.sendStatus(400);
                return
            }
            Menu.remove(req.params.id);
            res.send("Removed!")
        });
});

app.get("/locations", async (req, res) => {
    await db.all("SELECT * FROM Locations",
        [], (err, rows) => {
            if (err) {
                throw err;
            };
            res.send(rows);
        });
});

app.get("/locations/:id", async (req, res) => {
    await db.all("SELECT * FROM Locations WHERE id = (?)",
        [req.params.id],
        (err, rows) => {
            if (err) {
                throw err;
            };
            if (rows.length === 0) {
                res.sendStatus(404);
                return;
            }
            res.send(rows);
        });
});

app.post("/locations", (req, res) => {
    const { location, company, manager } = req.body
    if (!location || !company || !manager) {
        res.sendStatus(400);
        return
    }
    Location.add(req.body.location, req.body.company, req.body.manager);
    res.send("Added!");
});

app.delete("/locations/:id", async (req, res) => {
    await db.all("SELECT * FROM Locations WHERE id = (?)",
        [req.params.id], (err, rows) => {
            if (err) { throw err }
            if (rows.length === 0) {
                res.sendStatus(400);
                return
            }
            Location.remove(req.params.id);
            res.send("Removed!")
        });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

module.exports = {app, db}