import { app } from "../../../../app";
import request from "supertest";
import createConnection from "../../../../database/index";
import { Connection } from "typeorm";

let connection: Connection;

describe("Create User Controller.", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new user.", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "Test User",
      email: "test_user@fin_api.com.br",
      password: "test_password",
    });

    expect(response.status).toBe(201);
  });

  it("should not be able to create a new user with name exists.", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Test User",
      email: "test_user@fin_api.com.br",
      password: "test_password",
    });

    const response = await request(app).post("/api/v1/users").send({
      name: "Test User",
      email: "test_user@fin_api.com.br",
      password: "test_password",
    });

    expect(response.status).toBe(400);
  });
});
