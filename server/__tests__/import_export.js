const request = require("supertest");
const app = require("../server");

const sampleData = require("../../sample_files/africa.geo.json")

describe("Map import and export", () => {
    let mapId;

    it("should create a new map and return the map ID", async () => {
        const res = await request(app).post("/map").send(sampleData.map);
        expect(res.statusCode).toEqual(200);
        expect(res.body.id).toBeDefined();
        mapId = res.body.id;
    });

    it("should export the map as GeoJSON and return the exported file", async () => {
        const res = await request(app).get(`/downloadgeo/${mapId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.type).toEqual("application/json");
        expect(res.body).toEqual(sampleData.exportedGeoJSON);
    });

    it("should export the map as Shapefile and return the exported file", async () => {
        const res = await request(app).get(`/downloadshp/${mapId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.type).toEqual("application/zip");
        // Note: Binary files should be compared differently, this is just an example
        expect(res.body).toEqual(sampleData.exportedShapefile);
    });

    afterAll(async () => {
        // Clean up by deleting the map
        await request(app).delete(`/map/${mapId}`);
    });
});