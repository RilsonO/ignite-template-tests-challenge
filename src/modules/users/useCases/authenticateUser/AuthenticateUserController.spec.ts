import { app } from "../../../../app";
import request from "supertest";
import createConnection from "../../../../database/index";
import { Connection } from "typeorm";
import { hash } from "bcryptjs";
import { v4 as uuidV4 } from "uuid";

let connection: Connection;

describe("Authenticate User Controller.", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash("test_password", 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, created_at, updated_at)
        values('${id}','Test User', 'test_user@fin_api.com.br', '${password}', 'now()','now()')
      `
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to authenticate a user.", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "test_user@fin_api.com.br",
      password: "test_password",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("Should not be able to authenticate a user with incorrect email or password.", async () => {
    const incorrectEmailResponse = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "incorrect_email",
        password: "test_password",
      });

    const incorrectPasswordResponse = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "test_user@fin_api.com.br",
        password: "incorrect_password",
      });

    expect(incorrectEmailResponse.status).toBe(401);
    expect(incorrectPasswordResponse.status).toBe(401);
  });
});
