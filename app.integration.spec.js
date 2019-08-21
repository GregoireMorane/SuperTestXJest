const request = require("supertest");

const app = require("./app");
const agent = request.agent(app);

describe("app", () => {
  describe("when authenticated", () => {
    beforeEach(async () => {
      await agent
        .post("/login")
        .send("username=randombrandon&password=randompassword");
    });

    describe("POST /messages", () => {
      describe("with non-empty content", () => {
        describe("with JavaScript code in personalWebsiteURL", () => {
          it("responds with error", done => {
            agent
              .post("/messages")
              .send(
                "content=ttt&personalWebsiteURL=javascript:alert('Hacked!');"
              )
              .then(response => {
                expect(response.statusCode).toBe(400);
                done();
              });
          });
        });

        describe("with HTTP URL in personalWebsiteURL", () => {
          it("responds with success", done => {
            agent
              .post("/messages")
              .send("content=ttt&personalWebsiteURL=https://www.lemonde.fr")
              .then(response => {
                expect(response.statusCode).toBe(201);
                done();
              });
          });
        });
      });
    });
  });
});
