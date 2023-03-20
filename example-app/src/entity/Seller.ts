import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { Car } from './Car'

export enum UserRoles {
  DESIGNER = 'designer',
  CLIENT = 'client'
}

@Entity()
export class Seller extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
    id: string

  @Column()
    name: string

  @OneToMany((type) => Car, (car) => car.seller)
    cars: Array<Car>
}
