import {
    Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne,
    RelationId, UpdateDateColumn, CreateDateColumn,
} from "typeorm";
import { IsDefined, Min, Max } from "class-validator";
import { CarDealer } from "./CarDealer";

export enum CarType {
    MODERN = "modern",
    OLD = "old",
    GHOST = "ghost"
}

@Entity()
export class Car extends BaseEntity{
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    @IsDefined()
    public name: string;

    @Column()
    public model: string;

    @Column()
    @Min(0)
    @Max(15)
    public age: number;

    @Column({ name: "street_number", nullable: true })
    public streetNumber: string;

    @Column({
        type: "enum",
        enum: CarType,
        default: CarType.GHOST
    })
    public carType: CarType;

    @ManyToOne(type => CarDealer, carDealer => carDealer.cars)
    public carDealer: CarDealer;

    @RelationId((car: Car) => car.carDealer)
    public carDealerId: number;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;
}
