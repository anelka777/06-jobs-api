const { app } = require("../app");
const { factory } = require("../util/seed_db");
const faker = require("@faker-js/faker").fakerEN_US;
const get_chai = require("../util/get_chai");

const User = require("../models/User");
const Job = require("../models/Job");

describe("tests for registration and logon", function () {
  // after(() => {
  //   server.close();
  // });

  it("should get the registration page", async () => {
    const { expect, request } = await get_chai();
    const req = request.execute(app).get("/api/v1/auth/register").send(); 
    expect(res).to.have.status(200);
    expect(res).to.have.property("body"); 
    expect(res.body).to.have.property("message");
    expect(res.body.message).to.include("Enter your name");
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
      .post("/api/v1/auth/register")
      .set("content-type", "application/x-www-form-urlencoded")
      .send(dataToPost);
    const res = await req;
    expect(res).to.have.status(200);
    expect(res).to.have.property("text");
    expect(res.text).to.include("Jobs List");
    newUser = await User.findOne({ email: this.user.email });
    expect(newUser).to.not.be.null;
  });

  it("should create a new job for the user", async () => {
    const { expect, request } = await get_chai();
    this.jobData = {
      company: faker.company.companyName(),
      position: faker.name.jobTitle(),
      status: 'pending',
      createdBy: this.user._id
    };

    const req = request
      .execute(app)
      .post("/api/v1/jobs")
      .set("content-type", "application/json")
      .send(this.jobData);

    const res = await req;
    expect(res).to.have.status(201);
    expect(res.body).to.have.property("company", this.jobData.company);
    expect(res.body).to.have.property("position", this.jobData.position);
    expect(res.body).to.have.property("status", this.jobData.status);
    expect(res.body).to.have.property("createdBy", this.user._id.toString());
    
    const newJob = await Job.findOne({ company: this.jobData.company });
    expect(newJob).to.not.be.null;
    expect(newJob.createdBy.toString()).to.equal(this.user._id.toString());
  });
});


