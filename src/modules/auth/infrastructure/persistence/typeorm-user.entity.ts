import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class TypeOrmUserEntity {
  @PrimaryColumn('varchar', { length: 36 })
  id: string;

  @Column('varchar', { unique: true, length: 150 })
  email: string;

  @Column('varchar', { length: 255 })
  passwordHash: string;

  @Column('varchar', { length: 120 })
  fullName: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
