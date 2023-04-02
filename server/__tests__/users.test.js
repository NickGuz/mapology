const supertest = require('supertest');
const server = require('../server');
const { User, sequelize } = require('../sequelizeTest');

const app = server;

/** 
 * Test register a new user
 */
test("POST /users", async () => {
    const data = {
        email: "test@test.com",
        username: "testuser",
        password: "123"
    };

    await supertest(app)
        .post("/users")
        .send(data)
        .expect(200)
        // can also test stuff like this but ignoring for now
        // .expect('Content-Type', /json/)
        // .expect('Content-Length', '15')
        .then(async (response) => {
            // Check the response (Jest stuff in this block)
            expect(response.body.id).toBeTruthy();
            expect(response.body.email).toBe(data.email);
            expect(response.body.username).toBe(data.username);
            expect(response.body.password).toBe(data.password);

            // Check the data in the database
            const user = await User.findOne({ where: { id: response.body.id }});
            expect(user).toBeTruthy();
            expect(user.email).toBe(data.email);
            expect(user.username).toBe(data.username);
            expect(user.password).toBe(data.password);
        });
});

/**
 * Test get a user
 */
// test("GET /users", async () => {
//     const user = await User.create({ 
//         email: "joe@test.com",
//         username: "joetest",
//         password: "1234"
//      });

//     await supertest(app)
//         .get("/users/" + user.id)
//         .expect(200)
//         .then((response) => {
//             expect(response.body.id).toBe(user.id);
//             expect(response.body.email).toBe(user.email);
//             expect(response.body.username).toBe(user.username);
//             expect(response.body.password).toBe(user.password);
//         });
// });

/** 
 * Test get all users
 */
test("GET /users", async () => {
    const user1 = await User.create({
        email: "joe@test.com",
        username: "joetest",
        password: "1234"
    });

    const user2 = await User.create({
        email: "bob@test.com",
        username: "bobtest",
        password: "12345"
    });

    await supertest(app)
        .get("/users")
        .expect(200)
        .then(async (response) => {
            expect(response).toBeTruthy();
        });
});

afterAll((done) => {
    sequelize.close();
    app.close();
    server.close();
    done();
})