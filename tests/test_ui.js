const { app } = require("../app");
const get_chai = require("../util/get_chai");

describe("test getting a page", function () {
    it("should get the index page", async () => {
        const { expect, request } = await get_chai();
        const req = request.execute(app).get("/").send();  // Делаем GET запрос на главную страницу
        const res = await req;
        expect(res).to.have.status(200);  // Проверяем, что статус ответа 200
        expect(res).to.have.property("text");  // Проверяем, что есть поле "text" с HTML-контентом
        expect(res.text).to.include("Jobs List");  // Проверяем, что текст страницы содержит "Click this link"
    });
});
