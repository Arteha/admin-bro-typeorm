import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany } from 'typeorm'
import { IsDefined } from 'class-validator'
import { Car } from './Car'

@Entity()
export class CarBuyer extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public carBuyerId: string;

  @Column()
  @IsDefined()
  public name: string;

  @OneToMany(() => Car, (car) => car.carDealer)
  public cars: Array<Car>;
}
