import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Twin } from "./twin";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255, nullable: false, unique: true })
  email!: string;

  @Column({ type: "varchar", length: 20, nullable: false })
  username!: string;

  @Column({ type: "varchar", length: 255, nullable: false, unique: true })
  password!: string;

  @OneToMany(() => Twin, (twin: Twin) => twin.owner)
  twins: Twin[];
}
