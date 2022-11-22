import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { TwinSchema } from "../twin/twin-schema";

@Entity()
export class UserSchema {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255, nullable: false, unique: true })
  email!: string;

  @Column({ type: "varchar", length: 20, nullable: false })
  username!: string;

  @Column({ type: "varchar", length: 255, nullable: false, unique: true })
  password!: string;

  @OneToMany(() => TwinSchema, (twin: TwinSchema) => twin.owner)
  twins: TwinSchema[];
}
