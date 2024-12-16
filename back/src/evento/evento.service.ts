import { Injectable, NotFoundException } from '@nestjs/common';
import { EventoEntity } from './evento.entity';
import { EventoDto } from './dto/evento.dto';
import { DataSource } from 'typeorm';
import { UsuarioEntity } from 'src/usuario/usuario.entity';
import { EspacioEntity } from 'src/espacio/espacio.entity';

@Injectable()
export class EventoService {

  private eventoRepository;
  private usuarioRepository;
  private espacioRepository;

  constructor(private dataSource: DataSource) 
  {
    this.eventoRepository = this.dataSource.getRepository(EventoEntity);
    this.usuarioRepository = this.dataSource.getRepository(UsuarioEntity);
    this.espacioRepository = this.dataSource.getRepository(EspacioEntity);
  }
  //**************************************//
  // Función para formatear horas al estilo HH:mm
  private formatearHora(hora: number): string 
  {
    const horas = Math.floor(hora).toString().padStart(2, '0'); // Formatea las horas
    const minutos = '00'; // Puedes ajustar si deseas incluir minutos reales
    return `${horas}:${minutos}`;
  }
  //**************************************//
  // Crear Evento
  async create(dto: EventoDto): Promise<any> 
  {
    const evento = this.eventoRepository.create(dto);
    await this.eventoRepository.save(evento);
    return { message: `evento: ${evento.nombre} creado` };
  }
  //**************************************//
  // Buscar Evento por id
  async findid(id: number): Promise<EventoEntity> 
  {
    const evento = await this.eventoRepository.findOneBy({ id });
    if (!evento) 
    {
      throw new NotFoundException({ message: 'evento no encontrado' });
    }
    return evento;
  }
  //**************************************//
  //EventosUsuarioNormal ()
  async EventosUsuarioNormal(): Promise<EventoEntity[]>
  {
    const eventos = await this.eventoRepository.find({
      relations: ['id_espacio'], order: {hora_inicio: 'ASC' }}); 
        
    return eventos.map(evento => ({
        nombre: evento.nombre,
        tipo_evento: evento.tipo_evento,
        fecha_evento: evento.fecha_evento,
        hora_inicio: this.formatearHora(evento.hora_inicio),
        hora_fin: this.formatearHora(evento.hora_fin),
        espacio: evento.id_espacio?.nombre,
    }));
  }
  //**************************************//
  // EventosFechaUserNormal (fecha)
  async EventosFechaUserNormal(fecha: string): Promise<EventoEntity[]>
  {
    const eventos = await this.eventoRepository.find({
      where: { fecha_evento : fecha }, relations: ['id_espacio'], order: {hora_inicio: 'ASC' }}); 
      
    return eventos.map(evento => ({
      nombre: evento.nombre,
      fecha_evento: evento.fecha_evento,
      hora_inicio: this.formatearHora(evento.hora_inicio),
      hora_fin: this.formatearHora(evento.hora_fin),
      espacio: evento.id_espacio?.nombre,
    }));
  }
  //**************************************//
  // EventosCreador (NombreCreador)
  async EventosCreador(NombreCreador: string): Promise<EventoEntity[]>
  {
    const usuarioCreador = await this.usuarioRepository.findOneBy({ nombre:NombreCreador });
    if(!usuarioCreador)
    {
      throw new NotFoundException({message: 'Usuario no registrado'});
    }
    const eventos = await this.eventoRepository.find({
      where: { id_usuario : usuarioCreador}, relations: ['id_espacio'], order: {hora_inicio: 'ASC' }}); 
      
    return eventos
  }
  //**************************************//
  // EventosAdmin (NombreAdmin)
  async EventosAdmin(NombreAdmin: string): Promise<EventoEntity[]>
  {
    const usuarioAdmin = await this.usuarioRepository.findOneBy({nombre:NombreAdmin});
    if(!usuarioAdmin)
    {
      throw new NotFoundException({message: 'Usuario no registrado'});
    }
    if(usuarioAdmin.tipousuario !== "Admin" && usuarioAdmin.tipousuario !== "SuperAdmin")
    {
      throw new NotFoundException({message: 'Usuario no es Admin'});
    }
    const eventos = await this.eventoRepository.find({
      relations: ['id_usuario','id_espacio'], order: {hora_inicio: 'ASC' }}); 
      
    return eventos
  }
  //**************************************//
  //eventosPendiente (nombreadmin)
  async eventosPendiente(nombreadmin: string): Promise<EventoEntity[]> 
  {
    // Obtener el usuario por ID
    const usuario = await this.dataSource.getRepository(UsuarioEntity).findOne({
      where: { nombre: nombreadmin }});
    if (!usuario) 
    {
      throw new NotFoundException({ message: 'Usuario no encontrado' });
    }
    // Validar que sea administrador
    if (usuario.tipousuario !== 'Admin' && usuario.tipousuario !== 'SuperAdmin') 
    {
      throw new NotFoundException('Acceso denegado: Solo los administradores pueden ver los registros pendientes.');
    }
    // Retornar registros pendientes
    return await this.eventoRepository.find({
      where: { estado: 'pendiente' }});
  }
  //**************************************//
  //changeuser (usuarioNombre, eventoNombre)
  async changeuser(usuarioNombre: string, eventoNombre: string): Promise<any> 
  {
    // Buscar al usuario por nombre
    const usuario = await this.dataSource.getRepository(UsuarioEntity).findOne({
    where: { nombre: usuarioNombre },});

    if (!usuario) 
    {
      throw new NotFoundException({ message: 'Usuario no encontrado' });
    }
    
    if(usuario.tipousuario != "Presidente OTB" && usuario.tipousuario != "Empresa")
    {
      throw new NotFoundException({ message: 'Usuario no se puede cambiar a este usuario' });
    }
    
    if(usuario.estado == "pendiende")
    {
      throw new NotFoundException({ message: 'Usuario no autorizado' });
    }

    // Buscar el evento por nombre
    const evento = await this.dataSource.getRepository(EventoEntity).findOne({
      where: { nombre: eventoNombre }, relations: ['id_usuario']});
    if (!evento) 
    {
      throw new NotFoundException({ message: 'Evento no encontrado' });
    }

    if(usuario.id == evento.id_usuario.id)
    {
      throw new NotFoundException({ message: 'Ya es el dueño del evento este usuario' });
    }
    // Actualizar el usuario de la reserva
    evento.id_usuario = usuario;
    await this.eventoRepository.save(evento);
    return { message: 'Usuario actualizado exitosamente en la reserva' };
  }
  //**************************************//
  // AddURL (id_evento, permisos)
  async AddURL (id_evento:number, permisos: string): Promise <EventoEntity>
  {
    const evento = await this.eventoRepository.findOne({where: {id: id_evento} });
    if(evento)
    {
      evento.urlpermisos=permisos;
    }
    else
    {
      throw new NotFoundException(`no se encontró el evento`);
    }
    return await this.eventoRepository.save(evento);
  }
  //**************************************//
  //updateStatus (id_evento,status)
  async updateStatus(id_evento: number, estado: string): Promise<any> 
  {
    // Validar la reserva
    const evento = await this.eventoRepository.findOne({
      where: { id:id_evento}});
    
    if (!evento) 
    {
      throw new NotFoundException({ message: 'Evento no existente' });
    }

    // Validar el estado
    if (!['pendiente', 'aprobado', 'rechazado','confirmado','aceptado'].includes(estado)) 
    {
      throw new Error('Estado inválido');
    }

    // Actualizar el estado
    evento.estado = estado;
    await this.eventoRepository.save(evento);

    return { message: `Reserva actualizada a ${estado}`};
  }
  //**************************************//
  // calcularDiasHastaEvento (nomevento)
  async calcularDiasHastaEvento(nomevento:string): Promise<number> 
  {
    // Convertir la fecha del evento a un objeto Date
    const evento = await this.eventoRepository.findOneBy( {nombre: nomevento});

    if (!evento) 
    {
      throw new NotFoundException({ message: 'evento no encontrado' });
    }

    if (evento.estado === 'confirmado') 
    {
      throw new NotFoundException({ message: 'Evento ya esta confirmado' });
    }
    if (evento.estado === 'rechazado') 
    {
      throw new NotFoundException({ message: 'Evento rechazado' });
    }
    const fechaEvento = new Date(evento.fecha_evento);
  
    // Restar un día a la fecha del evento
    const unDiaAntesDelEvento = new Date(fechaEvento);
    unDiaAntesDelEvento.setDate(unDiaAntesDelEvento.getDate() - 1);
  
    // Obtener la fecha actual
    const fechaActual = new Date();
  
    // Calcular la diferencia en milisegundos y convertir a días
    const diferenciaMilisegundos = unDiaAntesDelEvento.getTime() - fechaActual.getTime();
    const diasRestantes = Math.ceil(diferenciaMilisegundos / (1000 * 60 * 60 * 24));
  
    // Retornar el número de días restantes (0 si ya pasó o es hoy)
    return Math.max(0, diasRestantes);
  }
  //**************************************//
  // Reubicar evento (eventoNombre,espacioNombre)
  async reubicar(usuarioAdmin:string,eventoNombre:string,espacioNombre:string):Promise<any>
  {
    const usuario = this.usuarioRepository.findOneBy({nombre:usuarioAdmin});
    if (!usuario) 
    {
      throw new NotFoundException({ message: 'usuario no encontrado' });
    }
    if(usuario.tipousuario !== "Admin" && usuario.tipousuario !== "SuperAdmin")
    {
      throw new NotFoundException({ message: 'Solo un admin puede realizar dicha accion' });
    }
    const evento = this.eventoRepository.findOneBy( {nombre: eventoNombre});
    if (!evento) 
    {
      throw new NotFoundException({ message: 'evento no encontrado' });
    }
    const espacio = this.espacioRepository.findOneBy( {nombre: espacioNombre});
    if (!espacio) 
    {
      throw new NotFoundException({ message: 'espacio no encontrado' });
    }
    evento.id_espacio = espacio.id;
    await this.eventoRepository.save(evento);
    return { message: 'Actualizacion exitosa'};
  }

  //**************************************//
  // deleteevento (id_evento)
  async deleteevento(id_evento: number):Promise<any>
  {
    const result = await this.eventoRepository.delete({ id: id_evento });

    if (result.affected === 0) {
      throw new NotFoundException({ message: 'Evento no encontrado' });
    }

    return { message: 'Evento eliminado exitosamente' };
  }
}