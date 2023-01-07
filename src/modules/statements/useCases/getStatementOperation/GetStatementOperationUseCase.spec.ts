import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Get statement operation.", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementRepository
    );
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementRepository
    );
  });

  it("Should be able to get a statement operation by id.", async () => {
    const user = {
      name: "Rilson teste",
      email: "rilson_teste@gmail.com",
      password: "12345",
    };

    const createdUser = await createUserUseCase.execute(user);

    const createdStatement = await createStatementUseCase.execute({
      user_id: createdUser.id as string,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "deposit test",
    });

    const statement = await getStatementOperationUseCase.execute({
      user_id: createdUser.id as string,
      statement_id: createdStatement.id as string,
    });

    expect(statement).toHaveProperty("id");
  });

  it("Should not be able to get a statement operation by id with an none existent user.", async () => {
    const user = {
      name: "Rilson teste",
      email: "rilson_teste@gmail.com",
      password: "12345",
    };

    const createdUser = await createUserUseCase.execute(user);

    const createdStatement = await createStatementUseCase.execute({
      user_id: createdUser.id as string,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "deposit test",
    });

    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: "fake id",
        statement_id: createdStatement.id as string,
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("Should not be able to get a statement operation by id with an none existent statement.", async () => {
    const user = {
      name: "Rilson teste",
      email: "rilson_teste@gmail.com",
      password: "12345",
    };

    const createdUser = await createUserUseCase.execute(user);

    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: createdUser.id as string,
        statement_id: "fake id",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
