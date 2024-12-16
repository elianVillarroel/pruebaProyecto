import { Body, Controller, Delete, Get, Patch, Post, Query } from '@nestjs/common';
import { EspacioDto } from './dto/espacio.dto';
import { EspacioService } from './espacio.service';

@Controller('espacio')
export class EspacioController 
{

  constructor(private readonly espacioService: EspacioService) {}

  //Crear Espacio
  @Post()
  async create(@Body() dto: EspacioDto) 
  {
    return await this.espacioService.create(dto);
  }

  //Todos los espacios
  @Get()
  async getespacios()
  {
    return this.espacioService.getespacios();
  }
  
  //Crear Buscar espacio por nombre
  @Get('search')
  async search(@Body() body: { nombre: string }) 
  {
    const { nombre } = body;
    return await this.espacioService.getByNombre(nombre);
  }

  //Actualizar nombre del espacio
  @Patch('update-name')
  async updateNombre(@Body() body: { nombre: string, nuevoNombre: string }) 
  {
    const { nombre, nuevoNombre } = body;
    return await this.espacioService.updateNombre(nombre, nuevoNombre);
  }

  //Mostrar Espacios Disponibles
  @Get('disponibles')
  async getAvailableSpaces(@Body() body: {fecha:string}) 
  {
    const {fecha}=body;
    try 
    {
      const espaciosDisponibles = await this.espacioService.findAvailableSpaces(fecha);
      return {
        message: 'Espacios disponibles encontrados',
        data: espaciosDisponibles,
      };
    } catch (error) 
    {
      return {
        message: 'Ocurrió un error al buscar los espacios disponibles',
        error: error.message,
      };
    }
  }
}
