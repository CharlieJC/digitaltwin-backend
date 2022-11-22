import "reflect-metadata";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { User } from "./user";

@Entity()
export class Twin {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "numeric", nullable: false })
  code!: number;

  @ManyToOne(() => User, (user: User) => user.twins)
  @JoinColumn({ name: "ownerId" })
  owner!: User;

  @Column({ nullable: false })
  ownerId: string;
}
