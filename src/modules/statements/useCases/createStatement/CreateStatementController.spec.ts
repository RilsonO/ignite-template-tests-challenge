import { app } from "../../../../app";
import request from "supertest";
import createConnection from "../../../../database/index";
import { Connection } from "typeorm";
import { hash } from "bcryptjs";
import { v4 as uuidV4 } from "uuid";

let connection: Connection;

describe("Create Statement Controller.", () => {
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

  it("Should be able to create a statement of type deposit.", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "test_user@fin_api.com.br",
      password: "test_password",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 999.99,
        description: "salário",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  it("Should be able to create a statement of type withdraw.", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "test_user@fin_api.com.br",
      password: "test_password",
    });

    const { token } = responseToken.body;

    await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 999.99,
        description: "salário",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 999.99,
        description: "withdraw_test",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  it("Should not be able to create a statement of an none existent user.", async () => {
    const depositResponse = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 999.99,
        description: "salário",
      })
      .set({
        Authorization: `Bearer fake_token`,
      });

    const withdrawResponse = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 999.99,
        description: "withdraw_test",
      })
      .set({
        Authorization: `Bearer fake_token`,
      });

    expect(depositResponse.status).toBe(401);
    expect(withdrawResponse.status).toBe(401);
  });

  it("Should not be able to create a statement of type withdraw of insufficient funds.", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "test_user@fin_api.com.br",
      password: "test_password",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 100000,
        description: "withdraw_test",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(400);
  });
});
