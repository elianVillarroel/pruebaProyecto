import { Body, Controller, Post } from '@nestjs/common';
import { CalificacionService } from './calificacion.service';
import { CalificacionDto } from './dto/calificacion.dto';

@Controller('calificacion')
export class CalificacionController {

    constructor(private readonly calificacionservice: CalificacionService){}

     @Post()
     async create(@Body() dto:CalificacionDto){
        return await  this.calificacionservice.create(dto);
     }
}
