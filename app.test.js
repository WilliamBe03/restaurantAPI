const request = require("supertest")
const {app, db} = require("./app")


describe("GET /companies", () => {
    test("Should return companies or nothing", async () => {
        const response = await request(app).get("/companies");
        expect(response.statusCode).toBe(200);
    });
    describe("When ID is input", () => {
        test("ID given", async () => {
            await request(app).post("/companies").send({ "name": "Company", "logo": "A logo" });
            const response = await request(app).get("/companies/1");
            expect(response.statusCode).toBe(200)
            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"));
        });
        test("ID is invalid or doesn't exist", async () => {
            await request(app).post("/companies").send({ "name": "Company", "logo": "A logo" });
            const response = await request(app).get("/companies/hello");
            expect(response.statusCode).toBe(404)
        });
        test("Gives menus", async () => {
            await request(app).post("/companies").send({ "name": "MenuCompany", "logo": "logos" });
            await request(app).post("/menus").send({ "title": "burger", "company": "MenuCompany" });
            const response = await request(app).get("/companies/1/menus");
            expect(response.statusCode).toBe(200)
            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"));
        });
    });
});

describe("POST /companies", () => {
    describe("Given name and logo", () => {
        test("responses with 200", async () => {
            const response = await request(app).post("/companies").send({
                "name": "Company",
                "logo": "A logo"
            });
            expect(response.statusCode).toBe(200)
        });
        test("Gives success message", async () => {
            const response = await request(app).post("/companies").send({
                "name": "Company",
                "logo": "A logo"
            });
            expect(response.headers['content-type']).toEqual("text/html; charset=utf-8");
        });
        test("Adds to database", async () => {
            await request(app).post("/companies").send({ "name": "Lookup", "logo": "Some logo" });
            await db.all(`SELECT * FROM Companies WHERE name = "Lookup" AND logo = "Some logo"`, [],
                (err, rows) => {
                    expect(rows.length).toBeGreaterThan(0);
                });
        });
    });
    describe("When name and logo are missing", () => {
        test("Should reply with 400", async () => {
            const data = [
                {},
                { "name": "Company" },
                { "logo": "A logo" }
            ];
            for (const b of data) {
                const response = await request(app).post("/companies").send(b);
                expect(response.statusCode).toBe(400);
            }
        });
    });
});

describe("GET /menus", () => {
    test("Should return menus or nothing", async () => {
        const response = await request(app).get("/menus");
        expect(response.statusCode).toBe(200);
    });
    describe("When ID is input", () => {
        test("ID given", async () => {
            await request(app).post("/companies").send({ "name": "MenuCompany", "logo": "logos" });
            await request(app).post("/menus").send({ "title": "Company", "company": "MenuCompany" });
            const response = await request(app).get("/menus/1");
            expect(response.statusCode).toBe(200)
            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"));
        });
        test("ID is invalid or doesn't exist", async () => {
            const response = await request(app).get("/menus/hello");
            expect(response.statusCode).toBe(404)
        });
    });
});

describe("POST /menus", () => {
    describe("Given name and company", () => {
        test("responses with 200", async () => {
            await request(app).post("/companies").send({ "name": "MenuCompany", "logo": "logos" });
            const response = await request(app).post("/menus").send({
                "title": "Menu",
                "company": "MenuCompany"
            });
            expect(response.statusCode).toBe(200)
        });
        test("Gives success message", async () => {
            await request(app).post("/companies").send({ "name": "MenuCompany", "logo": "logos" });
            const response = await request(app).post("/menus").send({
                "title": "Menu",
                "company": "MenuCompany"
            });
            expect(response.headers['content-type']).toEqual("text/html; charset=utf-8");
        });
        test("Adds to database", async () => {
            await request(app).post("/companies").send({ "name": "LookupComp", "logo": "logos" });
            await request(app).post("/menus").send({ "title": "Lookup", "company": "LookupComp" });
            await db.all(`SELECT * FROM Menus WHERE title = "Lookup" AND company = 
            (SELECT id FROM Companies WHERE name = "LookupComp" AND logo = "logos")`, [],
                (err, rows) => {
                    expect(rows.length).toBeGreaterThan(0);
                });
        });
    });
    describe("When title and company are missing", () => {
        test("Should reply with 400", async () => {
            const data = [
                {},
                { "title": "Menu" },
                { "company": "LookupComp" }
            ];
            for (const b of data) {
                const response = await request(app).post("/menus").send(b);
                expect(response.statusCode).toBe(400);
            }
        });
    });
});


describe("GET /locations", () => {
    test("Should return locations or nothing", async () => {
        const response = await request(app).get("/locations");
        expect(response.statusCode).toBe(200);
    });
    describe("When ID is input", () => {
        test("ID given", async () => {
            await request(app).post("/companies").send({ "name": "LocCompany", "logo": "logos" });
            await request(app).post("/locations").send({ "location": "Place", "company": "LocCompany", "manager":"John" });
            const response = await request(app).get("/locations/1");
            expect(response.statusCode).toBe(200)
            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"));
        });
        test("ID is invalid or doesn't exist", async () => {
            const response = await request(app).get("/locations/hello");
            expect(response.statusCode).toBe(404)
        });
    });
});