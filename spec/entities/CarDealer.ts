import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany } from 'typeorm'
import { IsDefined } from 'class-validator'
import { Car } from './Car'

@Entity()
export class CarDealer extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  @IsDefined()
  public name: string;

  @OneToMany((type) => Car, (car) => car.carDealer)
  public cars: Array<Car>;
}
