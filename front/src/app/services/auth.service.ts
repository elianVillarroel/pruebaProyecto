import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/usuario'; // Tu API base

  constructor(private http: HttpClient) {}

  // Método para iniciar sesión
  login(usuario: { nombre: string, contrasena: string }): Observable<any> 
  {
    return this.http.post('http://localhost:3000/usuario/login', usuario);
  }

  // Método para registrar un nuevo usuario
  registrarusuario(usuario: { nombre: string; contrasena: string; email: string; numcontacto: number; tipousuario: string }): Observable<any> 
  {
    return this.http.post('http://localhost:3000/usuario',usuario);
  }

  //Metodo para registrar un nuevo evento
  registrarevento(evento: { nombre: string; tipo_evento: string; descripcion: string; id_usuario: string; id_espacio:string; fecha_evento:string; capacidad_personas: number; hora_inicio:number; hora_fin:number }):Observable<any>
  {
    return this.http.post('http://localhost:3000/evento',evento);
  }
  
  //Metodo para registrar un nuevo espacio
  registrarespacio(espacio: { nombre: string; ubicacion:string; costo: number }):Observable<any>
  {
    return this.http.post('http://localhost:3000/espacio',espacio);
  }

  //Metodo para mostrar un evento al ingresar presidente y empresas
  mostrarevento_usuarionormal():Observable<any>
  {
    return this.http.get('http://localhost:3000/evento/eventos-Usernormal');
  }

  //Metodo para mostrar un evento al ingresar presidente y empresas
  mostrarevento_creador(NombreCreador: { NombreCreador: string }):Observable<any>
  {
    return this.http.post('http://localhost:3000/evento/eventos-Creador',NombreCreador);
  }

  //Metodo para mostrar un evento al ingresar un usuario administrador
  mostrarevento_admin(NombreAdmin: { NombreAdmin: string }):Observable<any>
  {
    return this.http.post('http://localhost:3000/evento/eventos-Admin',NombreAdmin);
  }

  //Metodo para mostrar un evento para filtrar fecha para el calendario
  mostrarevento_filtrarfecha(fecha: { fecha :string  }):Observable<any>
  {
    return this.http.post('http://localhost:3000/evento/filtrar-fecha',fecha);
  }

  //Metodo para mostrar un evento al ingresar un usuario normal
  mostrarevento_eventospendientes(NombreAdmin: { NombreAdmin: string }):Observable<any>
  {
    return this.http.post('http://localhost:3000/evento/eventos-pend',NombreAdmin);
  }
}

