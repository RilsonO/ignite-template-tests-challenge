import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { v4 as uuid } from "uuid";

import { User } from "../../users/entities/User";

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
  TRANSFERS = "transfers",
}

@Entity("statements")
export class Statement {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column("uuid")
  user_id: string;

  @Column("uuid")
  sender_id: string | null;

  @ManyToOne(() => User, (user) => user.statement)
  @JoinColumn({ name: "user_id" })
  user: User;

  @OneToOne(() => User)
  @JoinColumn({ name: "sender_id" })
  sender: User | null;

  @Column()
  description: string;

  @Column("decimal", { precision: 5, scale: 2 })
  amount: number;

  @Column({ type: "enum", enum: OperationType })
  type: OperationType;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}
function OnToOne(arg0: () => typeof User, arg1: (user: any) => any) {
  throw new Error("Function not implemented.");
}
