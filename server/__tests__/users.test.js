const supertest = require('supertest');
const router = require('../AuthRouter');
const { Users, sequelize } = require('../Users');

const app = router;

/** 
 * Test register a new user
 */
test("POST /register", async () => {
    const data = {
        email: "test@test.com",
        username: "testuser",
        password: "123"
    };

    await supertest(app)
        .post("/register")
        .send(data)
        .expect(200)
        // can also test stuff like this but ignoring for now
        // .expect('Content-Type', /json/)
        // .expect('Content-Length', '15')
        .then(async (response) => {
            // Check the response (Jest stuff in this block I think)
            expect(response.body.id).toBeTruthy();
            expect(response.body.email).toBe(data.email);
            expect(response.body.title).toBe(data.username);
            expect(response.body.password).toBe(data.password);

            // Check the data in the database
            const user = await Users.findOne({ where: { id: response.body.id }});
            expect(user).toBeTruthy();
            expect(user.email).toBe(data.email);
            expect(user.username).toBe(data.username);
            expect(user.password).toBe(data.password);
        });
});

/**
 * Test get a user
 */
test("GET /users", async () => {
    const user = await Users.create({ 
        email: "joe@test.com",
        username: "joetest",
        password: "1234"
     });

    await supertest(app)
        .get("/users/" + user.id)
        .expect(200)
        .then((response) => {
            expect(response.body.id).toBe(user.id);
            expect(response.body.email).toBe(user.email);
            expect(response.body.username).toBe(user.username);
            expect(response.body.password).toBe(user.password);
        });
});

afterAll(() => {
    // TODO Don't keep SQL connection in Users, this is just temporary
    sequelize.close();
})
