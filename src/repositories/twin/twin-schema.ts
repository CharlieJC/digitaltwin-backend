import "reflect-metadata";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { UserSchema } from "../user/user-schema";

@Entity()
export class TwinSchema {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "numeric", nullable: false })
  code!: number;

  @ManyToOne(() => UserSchema, (user: UserSchema) => user.twins)
  @JoinColumn({ name: "ownerId" })
  owner!: UserSchema;

  @Column({ nullable: false })
  ownerId: string;
}
