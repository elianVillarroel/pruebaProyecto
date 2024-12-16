import { Body, Controller, Post, Patch, Get } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioDto } from './dto/usuario.dto';

@Controller('usuario')
export class UsuarioController {

   constructor(private readonly usuarioservice: UsuarioService){}


   @Get()
   async getusuarios()
   {
      return await this.usuarioservice.getusuarios();
   }
    
   @Post()
   async create(@Body() dto:UsuarioDto){
      return await  this.usuarioservice.create(dto);
   }
   @Get('usuarioid')
   async findid(@Body() body: {id:number})
   {
      const {id} = body;
      return await this.usuarioservice.findid(id);
   }

   @Post('login')
   async findnombre(@Body() body: { nombre: string, contrasena: string }) 
   {
      const { nombre, contrasena } = body;
      return await this.usuarioservice.findnombre(nombre, contrasena);
   }

   @Patch('ascender-superadmin')
   async ascenderSuperAdmin(@Body() body: { idSuperAdmin: number; idUsuario: number },) 
   {
      const { idSuperAdmin, idUsuario } = body;
      return await this.usuarioservice.ascenderSuperAdmin(idSuperAdmin, idUsuario);
   }
     
   @Patch('descender-admin')
   async descenderAdmin(@Body() body: { idSuperAdmin: number; idUsuario: number },) 
   {
      const { idSuperAdmin, idUsuario } = body;
      return await this.usuarioservice.descenderAdmin(idSuperAdmin, idUsuario);
   }

   @Patch('aceptar-user')
   async aceptuser(@Body() body: {idAdmin:number,idusuario:number})
   {
      const {idAdmin,idusuario} = body;
      return await this.usuarioservice.changeactivado(idAdmin,idusuario);
   }
   @Patch('rechazar-user')
   async rechuser(@Body() body: {idAdmin:number,idusuario:number})
   {
      const {idAdmin,idusuario} = body;
      return await this.usuarioservice.rechazaruser(idAdmin,idusuario);
   }
}
