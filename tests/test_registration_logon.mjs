const { app } = require("../app");
const { factory, seed_db } = require("../util/seed_db");
const faker = require("@faker-js/faker");
const { get_chai } = require("../util/get_chai");

const User = require("../models/User");

describe("tests for registration and logon", function () {
    it("should get the registration page", async () => {
        const { expect, request } = await get_chai();
        const req = request.execute(app).get("/auth/register").send();
        const res = await req;
        expect(res).to.have.status(200);
        expect(res).to.have.property("text");
        expect(res.text).to.include("Enter your name");
    });

    it("should register the user", async () => {
        const { expect, request } = await get_chai();
        this.password = faker.internet.password();
        this.user = await factory.build("user", { password: this.password });

        const dataToPost = {
            name: this.user.name,
            email: this.user.email,
            password: this.password,
            password1: this.password,
        };

        const req = request
        .execute(app)
        .post("/auth/register")
        .set("Content-Type", "application/x-www-form-urlencoded")
        .send(dataToPost);

        const res = await req;
        expect(res).to.have.status(200);
        expect(res).to.have.property("text");
        expect(res.text).to.include("Jobs List");

        const newUser = await User.findOne({ email: this.user.email });
        expect(newUser).to.not.be.null;
        expect(newUser.name).to.equal(this.user.name);
    });
});


