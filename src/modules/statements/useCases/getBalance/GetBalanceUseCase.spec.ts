import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;
let inMemoryStatementRepository: InMemoryStatementsRepository;

describe("Get balance.", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementRepository,
      inMemoryUsersRepository
    );
  });

  it("Should be able to get balance of a user.", async () => {
    const user = {
      name: "Rilson teste",
      email: "rilson_teste@gmail.com",
      password: "12345",
    };

    const createdUser = await createUserUseCase.execute(user);

    const statement = await getBalanceUseCase.execute({
      user_id: createdUser.id as string,
    });

    expect(statement).toHaveProperty("balance");
  });

  it("Should not be able to get balance when use was not found.", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({ user_id: "fake id" });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
