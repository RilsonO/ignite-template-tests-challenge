import { AppError } from "../../../../shared/errors/AppError";

export namespace CreateTransfersError {
  export class UserNotFound extends AppError {
    constructor() {
      super("User not found", 404);
    }
  }

  export class RecipientUserNotFound extends AppError {
    constructor() {
      super("Recipient user not found", 404);
    }
  }

  export class InsufficientFunds extends AppError {
    constructor() {
      super("Insufficient funds", 400);
    }
  }
}
