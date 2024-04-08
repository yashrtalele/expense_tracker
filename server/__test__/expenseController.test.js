const supertest = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../app.js");
const User = require("../models/UserModel.js");
const Expense = require("../models/ExpenseModel.js");
jest.setTimeout(10000);
jwt.verify = jest.fn().mockReturnValue({ id: 1, username: "test" });
const token = "token";
describe("expense controller", () => {
    describe("given the token does not exist", () => {
        it("should return a 401", async () => {
            await supertest(app).get("/transactions/getExpense").expect(401);
        });
        it("should return a 401", async () => {
            await supertest(app).post("/transactions/addExpense").expect(401);
        });
        it("should return a 401", async () => {
            await supertest(app)
                .delete("/transactions/deleteExpense/1")
                .expect(401);
        });
    });

    describe("given the user is invalid", () => {
        it("should return a 401", async () => {
            User.findById = jest.fn().mockResolvedValue(null);
            await supertest(app)
                .get("/transactions/getExpense")
                .set("Authorization", `Bearer ${token}`)
                .expect(401);
        });
        it("should return a 401", async () => {
            User.findById = jest.fn().mockResolvedValue(null);
            const payload = {
                title: "March Salary",
                amount: 5000,
                type: "Income",
                date: "03/03/2024",
                category: "Salary",
                description: "None",
            };
            const res = await supertest(app)
                .post("/transactions/addExpense")
                .set("Authorization", `Bearer ${token}`)
                .send(payload)
                .expect(401);
            expect(res.body.message).toBe("Not authorized.");
        });
        it("should return a 401", async () => {
            await supertest(app)
                .delete("/transactions/deleteExpense/1")
                .set("Authorization", `Bearer ${token}`)
                .expect(401);
        });
    });

    describe("given the server error", () => {
        it("should return a 500", async () => {
            User.findById = jest
                .fn()
                .mockResolvedValue({ username: "test", _id: 1 });
            const payload = {
                title: "March Salary",
                amount: 5000,
                type: "Income",
                date: "03/03/2024",
                category: "Salary",
                description: "None",
            };
            await supertest(app)
                .post("/transactions/addExpense")
                .set("Authorization", `Bearer ${token}`)
                .send(payload)
                .expect(500);
        });
        it("should return a 500", async () => {
            await supertest(app)
                .delete("/transactions/deleteExpense/1")
                .set("Authorization", `Bearer ${token}`)
                .expect(500);
        });
    });
});
