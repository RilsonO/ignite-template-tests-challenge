import { app } from "../../../../app";
import request from "supertest";
import createConnection from "../../../../database/index";
import { Connection } from "typeorm";
import { hash } from "bcryptjs";
import { v4 as uuidV4 } from "uuid";

let connection: Connection;

describe("Get Balance Controller.", () => {
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

  it("Should be able to get balance of a user.", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "test_user@fin_api.com.br",
      password: "test_password",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .get("/api/v1/statements/balance")
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("balance");
  });

  it("Should not be able to get balance when use was not found.", async () => {
    const response = await request(app).get("/api/v1/statements/balance").set({
      Authorization: `Bearer fake_token`,
    });

    expect(response.status).toBe(401);
  });
});
