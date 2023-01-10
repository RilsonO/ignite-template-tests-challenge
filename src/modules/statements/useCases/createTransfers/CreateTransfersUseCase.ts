import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { CreateTransfersError } from "./CreateTransfersError";

@injectable()
export class CreateTransfersUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({
    user_id,
    type,
    amount,
    description,
    sender_id,
  }: ICreateStatementDTO) {
    const sender_id_converterd = sender_id as string;
    const user = await this.usersRepository.findById(sender_id_converterd);
    const recipientUser = await this.usersRepository.findById(user_id);

    if (!sender_id && !user) {
      throw new CreateTransfersError.UserNotFound();
    }

    if (!recipientUser) {
      throw new CreateTransfersError.RecipientUserNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({
      user_id: sender_id_converterd,
    });

    if (balance < amount) {
      throw new CreateTransfersError.InsufficientFunds();
    }

    const statementOperation = await this.statementsRepository.create({
      user_id,
      type,
      amount,
      description,
      sender_id,
    });

    return statementOperation;
  }
}
