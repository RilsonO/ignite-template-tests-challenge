import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { CreateTransfersUseCase } from "./CreateTransfersUseCase";

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
  TRANSFERS = "transfers",
}

export class CreateTransfersController {
  async execute(request: Request, response: Response) {
    const { user_id } = request.params;
    const { id: sender_id } = request.user;
    const { amount, description } = request.body;

    const splittedPath = request.originalUrl.split("/");
    const type = splittedPath[splittedPath.length - 2] as OperationType;

    const createStatement = container.resolve(CreateTransfersUseCase);

    const statement = await createStatement.execute({
      user_id,
      type,
      amount,
      description,
      sender_id,
    });

    return response.status(201).json(statement);
  }
}
