import { IsDefined, Max, Min } from 'class-validator'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm'
import { CarBuyer } from './CarBuyer.js'
import { CarDealer } from './CarDealer.js'

export enum CarType {
  MODERN = 'modern',
  OLD = 'old',
  GHOST = 'ghost'
}

@Entity()
export class Car extends BaseEntity {
  @PrimaryGeneratedColumn()
  public carId: number

  @Column()
  @IsDefined()
  public name: string

  @Column()
  public model: string

  @Column()
  @Min(0)
  @Max(15)
  public age: number

  @Column()
  @Min(0)
  @Max(15)
  public stringAge: number

  @Column({ name: 'street_number', nullable: true })
  public streetNumber: string

  @Column({
    type: 'enum',
    enum: CarType,
    default: CarType.GHOST,
  })
  public carType: CarType

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  public meta

  @ManyToOne(() => CarDealer, (carDealer) => carDealer.cars)
  @JoinColumn({
    name: 'car_dealer_id',
  })
  public carDealer: CarDealer

  @Column({ name: 'car_dealer_id', type: 'integer', nullable: true })
  public carDealerId: number

  @ManyToOne(() => CarBuyer, (carBuyer) => carBuyer.cars)
  @JoinColumn({
    name: 'car_buyer_id',
  })
  public carBuyer: CarBuyer

  @Column({ name: 'car_buyer_id', type: 'uuid', nullable: true })
  @RelationId((car: Car) => car.carBuyer)
  public carBuyerId: string

  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt: Date
}
