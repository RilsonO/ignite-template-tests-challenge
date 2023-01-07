import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create user.", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("Should be able to create a new user.", async () => {
    const user = await createUserUseCase.execute({
      name: "Rilson",
      email: "rilson@gmail.com",
      password: "12345",
    });

    expect(user).toHaveProperty("id");
  });

  it("Should not be able to create a user with name exist.", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "Rilson",
        email: "rilson@gmail.com",
        password: "12345",
      });

      await createUserUseCase.execute({
        name: "Rilson",
        email: "rilson@gmail.com",
        password: "12345",
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
