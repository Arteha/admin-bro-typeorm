import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { Car } from './Car'

export enum UserRoles {
  DESIGNER = 'designer',
  CLIENT = 'client'
}

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
    id: number

  @Column()
    firstName: string

  @Column()
    lastName: string

  @Column()
    age: number

  @Column({
    type: 'enum',
    enum: UserRoles,
  })
    role: UserRoles

  @OneToMany((type) => Car, (car) => car.owner)
    cars: Array<Car>
}
