import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateStatementUseCase } from "./CreateStatementUseCase";

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

export class CreateStatementController {
  async execute(request: Request, response: Response) {
    const { user_id: recipient_id } = request.params;
    const { id: user_id } = request.user;
    const { amount, description } = request.body;

    const splittedPath = request.originalUrl.split("/");

    const positionType = recipient_id
      ? splittedPath.length - 2
      : splittedPath.length - 1;

    const type = splittedPath[positionType] as OperationType;

    const createStatement = container.resolve(CreateStatementUseCase);

    const statement = await createStatement.execute({
      user_id,
      type,
      amount,
      description,
      sender_id: null,
    });

    return response.status(201).json(statement);
  }
}
