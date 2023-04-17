process.env.TEST = true;

const supertest = require("supertest");
const server = require("../server");
const { Features } = require("../sequelize/sequelize");
let f = Features;

const app = server;

test("GET /maps", async () => {
    await supertest(app)
        .get("/api/maps")
        .expect(200)
        .then(async (response) => {
            expect(response).toBeTruthy();
        });
});

// test to place feature, doesn't work
// test("POST /feature", async () => {
//     const newFeature = {
//         mapId: 1,
//         type: "Feature",
//         properties: {
//             name: "New feature",
//             description: "This is a new feature",
//         },
//         geometry: {
//             type: "Point",
//             coordinates: [10, 20],
//         },
//     };

//     await supertest(app)
//         .post("/api/feature")
//         .send(newFeature)
//         .expect(201)
//         .then(async (response) => {
//             expect(response.body.id).toBeTruthy();
//             expect(response.body.mapId).toBe(newFeature.mapId);
//             expect(response.body.type).toBe(newFeature.type);
//             expect(response.body.properties).toEqual(newFeature.properties);
//             expect(response.body.geometry).toEqual(newFeature.geometry);

//             const insertedFeature = await f.findOne({
//                 where: { id: response.body.id },
//             });
//             expect(insertedFeature).toBeTruthy();
//             expect(insertedFeature.mapId).toBe(newFeature.mapId);
//             expect(insertedFeature.type).toBe(newFeature.type);
//             expect(insertedFeature.properties).toEqual(newFeature.properties);
//             expect(insertedFeature.geometry).toEqual(newFeature.geometry);
//         });
// });


afterAll((done) => {
    app.close();
    server.close();
    done();
});
