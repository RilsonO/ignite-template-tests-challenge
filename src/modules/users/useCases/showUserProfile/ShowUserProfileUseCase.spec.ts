import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show user Profile.", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
  });

  it("Should be able to show a user profile.", async () => {
    const user = {
      name: "Rilson teste",
      email: "rilson_teste@gmail.com",
      password: "12345",
    };

    const createdUser = await createUserUseCase.execute(user);

    const userProfile = await showUserProfileUseCase.execute(
      createdUser.id as string
    );

    expect(userProfile).toEqual(createdUser);
  });

  it("Should not be able to show a user profile.", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("fake id");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
