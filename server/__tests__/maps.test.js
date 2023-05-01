process.env.TEST = true;

const supertest = require("supertest");
const server = require("../server");
const { Features } = require("../sequelize/sequelize");

const app = server;

// Test get all maps
test("GET /maps", async () => {
    await supertest(app)
        .get("/api/maps")
        .expect(200)
        .then(async (response) => {
            expect(response).toBeTruthy();
        });
});

// Test insert new feature
test("POST /feature", async () => {
    const newFeature = {
        mapId: 1,
        data: {
            type: "Feature",
            properties: {
                name: "New feature",
                description: "This is a new feature",
            },
            geometry: {
                type: "Point",
                coordinates: [10, 20],
            },
        }
    };

    await supertest(app)
        .post("/api/feature")
        .send(newFeature)
        .expect(201)
        .then(async (response) => {
            expect(response.body.data.id).toBeTruthy();
            expect(response.body.data.mapId).toBe(newFeature.mapId);
            expect(response.body.data.type).toBe(newFeature.data.type);
            expect(response.body.data.properties).toEqual(newFeature.data.properties);
            expect(response.body.data.geometry).toEqual(newFeature.data.geometry);

            const insertedFeature = await Features.findOne({
                where: response.body.data
            });
            expect(insertedFeature).toBeTruthy();
            expect(insertedFeature.mapId).toBe(newFeature.mapId);
            expect(insertedFeature.type).toBe(newFeature.data.type);
            expect(insertedFeature.properties).toEqual(newFeature.data.properties);
            expect(insertedFeature.geometry).toEqual(newFeature.data.geometry);
        });
});

test("PUT /property", async () => {
    const newFeature = {
        mapId: 1,
        data: {
            type: "Feature",
            properties: {
                name: "New feature",
                description: "This is a new feature",
            },
            geometry: {
                type: "Point",
                coordinates: [10, 20],
            },
        },
    };

    await supertest(app)
        .post("/api/feature")
        .send(newFeature)
        .expect(201)
        .then(async (response) => {
            expect(response.body.data.id).toBeTruthy();
            expect(response.body.data.mapId).toBe(newFeature.mapId);
            expect(response.body.data.type).toBe(newFeature.data.type);
            expect(response.body.data.properties).toEqual(
                newFeature.data.properties
            );
            expect(response.body.data.geometry).toEqual(
                newFeature.data.geometry
            );

            const insertedFeature = await Features.findOne({
                where: response.body.data,
            });
            expect(insertedFeature).toBeTruthy();
            expect(insertedFeature.mapId).toBe(newFeature.mapId);
            expect(insertedFeature.type).toBe(newFeature.data.type);
            expect(insertedFeature.properties).toEqual(
                newFeature.data.properties
            );
            expect(insertedFeature.geometry).toEqual(newFeature.data.geometry);
        });
    
    const newProperty = {
        data: {
            
                name: "New feature",
                description: "This is a new feature",
                title: "new prop",
            
        },
    };

     await supertest(app)
         .put(`/api/feature/props/${1}`)
         .send(newProperty)
         .expect(200)
         .then(async (response) => {
            console.log(response.body);
             expect(response.body.data.properties).toEqual(
                 newProperty.data.properties
             );

             const insertedFeature = await Features.findOne({
                 where: response.body.data,
             });
             expect(insertedFeature).toBeTruthy();
         });
    });


afterAll((done) => {
    app.close();
    server.close();
    done();
});
