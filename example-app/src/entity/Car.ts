import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, RelationId, ManyToOne } from 'typeorm'
import { User } from './User'

@Entity()
export class Car extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne((type) => User, (user) => user.cars)
  owner: User;

  // in order be able to fetch resources in admin-bro - we have to have id available
  @RelationId((car: Car) => car.owner)
  ownerId: number;
}
