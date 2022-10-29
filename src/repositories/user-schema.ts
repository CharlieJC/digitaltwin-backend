import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class UserSchema {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: "varchar", length: 255, nullable: false, unique: true })
  email!: string;

  @Column({ type: "varchar", length: 20, nullable: false })
  username!: string;

  @Column({ type: "varchar", length: 255, nullable: false, unique: true })
  password!: string;

 
}