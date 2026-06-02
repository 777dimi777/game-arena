import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  genre!: string;

  @Column()
  teamSize!: number;

  @Column({ nullable: true })
  imageUrl?: string;
}