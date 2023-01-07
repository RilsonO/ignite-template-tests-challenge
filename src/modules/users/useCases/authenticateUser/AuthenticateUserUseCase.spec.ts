import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticatedUserUseCase: AuthenticateUserUseCase;

describe("Authenticated user.", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticatedUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
  });

  it("Should be able to authenticate a user.", async () => {
    const user = {
      name: "Rilson teste",
      email: "rilson_teste@gmail.com",
      password: "12345",
    };

    const createdUser = await createUserUseCase.execute(user);

    const authenticateToken = await authenticatedUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(createdUser).toHaveProperty("id");
    expect(authenticateToken).toHaveProperty("token");
  });

  it("Should not be able to authenticate a user with incorrect email or password.", async () => {
    const user = {
      name: "Rilson teste",
      email: "rilson_teste@gmail.com",
      password: "12345",
    };

    const createdUser = await createUserUseCase.execute(user);

    expect(createdUser).toHaveProperty("id");

    expect(async () => {
      await authenticatedUserUseCase.execute({
        email: "email incorrect",
        password: user.password,
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);

    expect(async () => {
      await authenticatedUserUseCase.execute({
        email: user.email,
        password: "password incorrect",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
