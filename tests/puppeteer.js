const puppeteer = require("puppeteer");
require("../app");
const { seed_db, testUserPassword } = require("../util/seed_db");

let testUser = null;
let page = null;
let browser = null;

describe("jobs-ejs puppeteer test", function () {
    before(async function () {
        this.timeout(10000);
        browser = await puppeteer.launch();
        page = await browser.newPage();
        await page.goto("http://localhost:3000");
    });

    after(async function () {
        this.timeout(5000);
        await browser.close();
    });

    describe("index page test", function () {
        it("should find the logon and register links", async () => {
        const logonLink = await page.waitForSelector("#logon");
        const registerLink = await page.waitForSelector("#register");

        expect(logonLink).to.not.be.null;
        expect(registerLink).to.not.be.null;
        });

        it("should navigate to the register page", async () => {
        await page.click("#register");
        await page.waitForSelector("#register-div");
        });

        it("should register the user", async () => {
        testUser = await seed_db();


        await page.type("#name", testUser.name);
        await page.type("#email1", testUser.email);
        await page.type("#password1", testUserPassword);
        await page.type("#password2", testUserPassword);


        await page.click("#register-button");
        await page.waitForSelector("#jobs");

        const jobsMessage = await page.$eval("#jobs-message", (el) => el.textContent);
        expect(jobsMessage).to.include("Welcome");


        const jobsTable = await page.waitForSelector("#jobs-table");
        expect(jobsTable).to.not.be.null;
        });
    });

    describe("logon page test", function () {
        it("should navigate to the logon page", async () => {
        await page.click("#logon");
        await page.waitForSelector("#logon-div");
        });

        it("should log in the user", async () => {
        
        const emailField = await page.waitForSelector('#email');
        const passwordField = await page.waitForSelector('#password');
        const logonButton = await page.waitForSelector('#logon-button');
        
        await emailField.type(testUser.email);
        await passwordField.type(testUserPassword);
        
        await logonButton.click();
        await page.waitForNavigation();

        const logonMessage = await page.$eval("p", (el) => el.textContent);
        expect(logonMessage).to.include(`${testUser.name} is logged on.`);
        });
    });

    describe("job adding test", function () {
        it("should add a new job", async () => {
        await page.click("#add-job");
        await page.waitForSelector("#edit-job");


        await page.type("#company", "Test Company");
        await page.type("#position", "Test Position");
        await page.select("#status", "pending");


        await page.click("#adding-job");
        await page.waitForSelector("#jobs");

        const jobsTable = await page.$("#jobs-table");
        const rows = await jobsTable.$$eval("tr", rows => rows.length);
        expect(rows).to.be.greaterThan(1);
        });
    });
});

