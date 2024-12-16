import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bienvenidoregistro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bienvenidoregistro.component.html',
  styleUrls: ['./bienvenidoregistro.component.css'],
})
export class BienvenidoregistroComponent implements OnInit {
  eventos: any[] = [];
  nuevoEvento: any = {
    nombre: '',
    fecha: '',
    hora_inicio: null,
    hora_fin: null,
    capacidad_personas: null,
    tipo: '',
    descripcion: '',
  };
  mostrarModal: boolean = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadEventos();
  }

  async loadEventos() {
    try {
      this.eventos = await this.apiService.getEventosusuarionormal();
      console.log('Eventos cargados:', this.eventos);
    } catch (error) {
      console.error('Error al cargar eventos:', error);
    }
  }

  abrirModal() {
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  addEvento() {
    this.eventos.push({ ...this.nuevoEvento });
    console.log('Evento añadido:', this.nuevoEvento);
    this.nuevoEvento = {
      nombre: '',
      fecha: '',
      hora_inicio: null,
      hora_fin: null,
      capacidad_personas: null,
      tipo: '',
      descripcion: '',
    };
    this.cerrarModal();
  }
}
