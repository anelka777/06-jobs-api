const Job = require("../models/Job");
const { seed_db, testUserPassword } = require("../util/seed_db");
const { get_chai } = require("../util/get_chai");

describe("tests for job CRUD operations", function () {
    before(async () => {
        const { expect, request } = await get_chai();
        
        this.test_user = await seed_db();
        const { email } = this.test_user;
        const password = testUserPassword;

        const req = request.execute(app).post("/api/v1/logon").send({
        email,
        password,
        });

        const res = await req;
        this.token = res.body.token;
        expect(this.token).to.not.be.undefined;
    });

    it("should get the job list", async () => {
        const { expect, request } = await get_chai();

        const req = request
        .execute(app)
        .get("/api/v1/jobs")
        .set("Authorization", `Bearer ${this.token}`);

        const res = await req;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        expect(res.body.length).to.equal(20);
    });

    it("should add a new job", async () => {
        const { expect, request } = await get_chai();

        const jobData = {
        company: "New Company",
        position: "Software Developer",
        status: "pending",
        };

        const req = request
        .execute(app)
        .post("/api/v1/jobs")
        .set("Authorization", `Bearer ${this.token}`)
        .send(jobData);

        const res = await req;
        expect(res).to.have.status(201);
        expect(res.body).to.have.property("company").that.equals("New Company");
        

        const jobs = await Job.find({ createdBy: this.test_user._id });
        expect(jobs.length).to.equal(21);
    });

    it("should update a job", async () => {
        const { expect, request } = await get_chai();


        const job = await Job.findOne({ createdBy: this.test_user._id });
        const updatedData = { status: "interview" };

        const req = request
        .execute(app)
        .patch(`/api/v1/jobs/${job._id}`)
        .set("Authorization", `Bearer ${this.token}`)
        .send(updatedData);

        const res = await req;
        expect(res).to.have.status(200);
        expect(res.body.status).to.equal("interview");


        const updatedJob = await Job.findById(job._id);
        expect(updatedJob.status).to.equal("interview");
    });

    it("should delete a job", async () => {
        const { expect, request } = await get_chai();

        
        const job = await Job.findOne({ createdBy: this.test_user._id });

        const req = request
        .execute(app)
        .delete(`/api/v1/jobs/${job._id}`)
        .set("Authorization", `Bearer ${this.token}`);

        const res = await req;
        expect(res).to.have.status(200);
        
        
        const deletedJob = await Job.findById(job._id);
        expect(deletedJob).to.be.null;
    });
});
