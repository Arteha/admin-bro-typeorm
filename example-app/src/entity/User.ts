import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

export enum UserRoles {
  DESIGNER = 'designer',
  CLIENT = 'client'
}

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: number;

  @Column({
    type: 'enum',
    enum: UserRoles,
  })
  public role: UserRoles;
}
