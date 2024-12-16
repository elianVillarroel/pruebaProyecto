import { BadRequestException, Body, Controller, Delete, Get, Patch, Post} from '@nestjs/common';
import { EventoService } from './evento.service';
import { EventoDto } from './dto/evento.dto';
import { DataSource } from 'typeorm';
import { UsuarioEntity } from 'src/usuario/usuario.entity';
import { EspacioEntity } from 'src/espacio/espacio.entity';
import { EventoDto1 } from './dto/evento.dto1';

@Controller('evento')
export class EventoController {

   private usuariocontrol;
   private espaciocontrol;
   
   constructor(private readonly eventoservice: EventoService, private dataSource: DataSource)
   {
      this.usuariocontrol = this.dataSource.getRepository(UsuarioEntity);
      this.espaciocontrol = this.dataSource.getRepository(EspacioEntity);
   }

   //Crear Evento Presidente / Empresa
   @Post()
   async create(@Body() dto1:EventoDto1)
   {
      const usuario = await this.usuariocontrol.findOneBy({nombre: dto1.id_usuario});
      if (!usuario) 
      {
         throw new BadRequestException('Usuario no encontrado');
      }
      const espacio = await this.espaciocontrol.findOneBy({nombre: dto1.id_espacio});
      if (!espacio) 
      {
         throw new BadRequestException('Espacio no encontrado');
      }
      let costito = espacio.costo + dto1.capacidad_personas * 2 + (dto1.hora_fin - dto1.hora_inicio) * 10;
      switch (dto1.tipo_evento) 
      {
         case 'Mediambientales':
           costito = costito + 50;
           break;
         case 'Cultural':
            costito = costito + 60;
            break;
         case 'Comida':
            costito = costito + 80;
            break;
         case 'Politica':
            costito = costito + 100;
            break;
      }
      const dto: EventoDto ={
         nombre : dto1.nombre,
         tipo_evento: dto1.tipo_evento,
         descripcion: dto1.descripcion,
         id_usuario: usuario.id,
         id_espacio: espacio.id,
         fecha_evento: dto1.fecha_evento,
         capacidad_personas: dto1.capacidad_personas,
         hora_inicio: dto1.hora_inicio,
         hora_fin: dto1.hora_fin,
         costo: costito
      }
      return await  this.eventoservice.create(dto);
   }

   //Ver eventos Usuario Normal (nombre,fecha_evento,hora_inicio,hora_fin,espacio)
   @Get('eventos-Usernormal')
   async eventosUserNoraml()
   {
      const eventosdisponibles = await this.eventoservice.EventosUsuarioNormal();
      if (eventosdisponibles.length === 0) 
      {
         return {
            message: 'No hay eventos'};
      }
      else
      {
         return {
            message: 'Eventos disponibles encontrados',
            data: eventosdisponibles};
      }   
   }

   //Eventos por fecha (nombre,fecha_evento,hora_inicio,hora_fin,espacio)
   @Get('filtrar-fecha')
   async getEventosByFecha(@Body() body: {fecha:string})
   {
      const {fecha}=body;
      const eventosdisponibles = await this.eventoservice.EventosFechaUserNormal(fecha);
      if (eventosdisponibles.length === 0) {
         return {
            message: 'No hay eventos en esta fecha'
         };
      }
      else
      {
         return {
            message: 'Eventos disponibles encontrados',
            data: eventosdisponibles
         };
      } 
   }
   
   //Ver eventos propios Presidente / Empresa (completo)
   @Get('eventos-Creador')
   async eventosCreador(@Body() body: {NombreCreador:string})
   {
      const {NombreCreador} = body;
      const eventosCreador = await this.eventoservice.EventosCreador(NombreCreador);
      if (eventosCreador.length === 0) 
      {
         return {
            message: 'No hay eventos registrados'};
      }
      else
      {
         return {
            message: 'Eventos disponibles encontrados',
            data: eventosCreador};
      }
   }

   //Ver evento completo ADMIN (completo)
   @Get('eventos-Admin')
   async eventosAdmin(@Body() body: {NombreAdmin:string})
   {
      const {NombreAdmin} = body;
      const eventosAdmin = await this.eventoservice.EventosAdmin(NombreAdmin);
      if (eventosAdmin.length === 0) 
      {
         return {
            message: 'No hay eventos registrados'};
      }
      else
      {
         return {
            message: 'Eventos disponibles encontrados',
            data: eventosAdmin};
      }
   }

   //Ver eventos pendientes completo ADMIN (completo)
   @Get ('eventos-pend')
   async eventospendiente (@Body() body: {nombreadmin: string})
   {
      const {nombreadmin} = body;
      const eventos = await this.eventoservice.eventosPendiente(nombreadmin);
      if (eventos.length === 0) 
         {
            return {
               message: 'No hay eventos pendientes'};
         }
         else
         {
            return {
               message: 'Eventos pendientes encontrados',
               data: eventos};
         }
      
   }

   //Cambiar dueño evento
   @Patch('change-user')
   async changeUser(@Body() body: { usuarioNombre: string; eventoNombre: string }) 
   {
      const { usuarioNombre, eventoNombre } = body;
      return await this.eventoservice.changeuser(usuarioNombre, eventoNombre);
   }

   //Cambiar lugar evento
   @Patch('reubicar')
   async reubicar(@Body() body: {usuarioAdmin:string,eventoNombre:string; espacioNombre:string})
   {
      const {usuarioAdmin,eventoNombre,espacioNombre} = body;
      return await this.eventoservice.reubicar(usuarioAdmin,eventoNombre,espacioNombre);
   }
   //Cambiar estado de evento
   @Patch('update-statusres')
   async updatestares(@Body() body: {id_evento:number,status:string})
   {
      const {id_evento,status}=body;
      return await this.eventoservice.updateStatus(id_evento,status);
   }

   //Avisar tiempo max permisos
   @Get('aviso-permisos')
   async calcularDiasHastaEvento(@Body() body: {nomevento: string}): Promise<string> 
   {
      const {nomevento} = body;
      const canti = await this.eventoservice.calcularDiasHastaEvento(nomevento);
      return (`Quedan ${canti} dias para entregar los permisos`);
   }

   //Eliminar Evento
   @Delete('eliminar-evento')
   async eliminarevento(@Body() body: {id_evento: number}) 
   {
      const {id_evento} = body;
      return await this.eventoservice.deleteevento(id_evento);
   }  

}

/*


   @Get('eventos-espacio')
   async 
   {

   }

   
GENERAL
   //Agregar permisos
   @Patch('agregar-permiso')
   async agregarPermiso(@Body () body: {id_evento:number; permisos:string})
   {
      const { id_evento, permisos}=body;
      return await this.eventoservice.AddURL(id_evento,permisos);
   }

   try
   {
   la consulta
   }cath

   throw new Dtexception ()
*/