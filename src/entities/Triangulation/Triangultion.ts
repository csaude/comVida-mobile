import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Patient } from './Patient';

@Entity('triangulation') // Mapeia esta classe para a tabela "triangulation"
export class Triangulation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text', { unique: true })
  uuid!: string;

  @Column('json')
  form!: object;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patient_id' })
  patient!: Patient;

  @Column('text')
  type!: string; // Indica se é ATS ou Visita

  constructor(init?: Partial<Triangulation>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}
