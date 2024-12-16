import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { EventoEntity } from '../evento/evento.entity';
import { UsuarioEntity } from "src/usuario/usuario.entity";

@Entity({ name: 'calificaciones' })
export class CalificacionEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => EventoEntity, (evento) => evento.id, {nullable: false})
    @JoinColumn({ name: 'id_evento' })
    id_evento: EventoEntity;  

    @Column({ type: 'int', nullable: false })
    calificacion: number; 

    @Column({ type: 'varchar', nullable: false })
    comentario: string;

    @ManyToOne(() => UsuarioEntity, (usuario) => usuario.id, {nullable: false})
    @JoinColumn({ name: 'id_usuario' })
    id_usuario: UsuarioEntity; 
}