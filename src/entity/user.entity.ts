import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'Ghost' })
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: null })
  avatar: string | null;
}
