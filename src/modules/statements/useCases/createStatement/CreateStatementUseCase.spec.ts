import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Create statement.", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementRepository
    );
  });

  it("Should be able to create a statement of type deposit.", async () => {
    const user = {
      name: "Rilson teste",
      email: "rilson_teste@gmail.com",
      password: "12345",
    };

    const createdUser = await createUserUseCase.execute(user);

    const statement = await createStatementUseCase.execute({
      user_id: createdUser.id as string,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "deposit test",
    });

    expect(statement).toHaveProperty("id");
  });

  it("Should be able to create a statement of type withdraw.", async () => {
    const user = {
      name: "Rilson teste",
      email: "rilson_teste@gmail.com",
      password: "12345",
    };

    const createdUser = await createUserUseCase.execute(user);

    await createStatementUseCase.execute({
      user_id: createdUser.id as string,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "deposit test",
    });

    const statement = await createStatementUseCase.execute({
      user_id: createdUser.id as string,
      type: OperationType.WITHDRAW,
      amount: 100,
      description: "withdraw test",
    });

    expect(statement).toHaveProperty("id");
  });

  it("Should not be able to create a statement of an none existent user.", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "fake id",
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "deposit test",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);

    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "fake id",
        type: OperationType.WITHDRAW,
        amount: 100,
        description: "withdraw test",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("Should not be able to create a statement of type withdraw of insufficient funds.", async () => {
    const user = {
      name: "Rilson teste",
      email: "rilson_teste@gmail.com",
      password: "12345",
    };

    const createdUser = await createUserUseCase.execute(user);

    await createStatementUseCase.execute({
      user_id: createdUser.id as string,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "deposit test",
    });

    expect(async () => {
      await createStatementUseCase.execute({
        user_id: createdUser.id as string,
        type: OperationType.WITHDRAW,
        amount: 150,
        description: "withdraw test",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
