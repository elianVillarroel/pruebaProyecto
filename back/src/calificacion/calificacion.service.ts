import { Injectable, NotFoundException } from '@nestjs/common';
import { CalificacionEntity } from './calificacion.entity';
import { CalificacionDto } from './dto/calificacion.dto';
import { DataSource } from 'typeorm';

@Injectable()
export class CalificacionService {

    private calificacionRepository;

    constructor(private dataSource: DataSource) {
        this.calificacionRepository = this.dataSource.getRepository(CalificacionEntity);
    }

    async findById(id: number): Promise<CalificacionEntity> {
        const calificacion = await this.calificacionRepository.findOne({
            where: { id },
            relations: ['evento'], 
        });

        if (!calificacion) {
            throw new NotFoundException({ message: 'Calificación no encontrada' });
        }

        return calificacion;
    }

    async create(dto: CalificacionDto): Promise<any> {
        const calificacion = this.calificacionRepository.create(dto);
        await this.calificacionRepository.save(calificacion);
        return { message: `Calificación para evento: ${calificacion.id_evento} registrada` };
    }

}

