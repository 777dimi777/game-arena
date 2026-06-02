import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  tag!: string;

  @Column({ nullable: true })
  logoUrl?: string;

  @Column({ nullable: true })
  description?: string;
}