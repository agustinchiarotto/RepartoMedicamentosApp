import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { routerTransition } from '../router.animations';
import { Paciente } from './paciente';
import { PacienteService } from './paciente.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-productos',
  templateUrl: './paciente.component.html',
  animations: [routerTransition()]
})
export class PacienteComponent implements OnInit {
  @ViewChild('cerrarAgregar') cerrarAgregar: ElementRef;

  model: any = {};
  pacientes: Paciente[] = [];
  cols: any[];
  selectedPaciente: Paciente;
  hoy: string;

  constructor(
    private pacienteService: PacienteService
  ) { }


  ngOnInit() {
    this.getPacientes();

    this.cols = [
      { field: 'dni', header: 'DNI' },
      { field: 'nombre', header: 'Nombre' },
      { field: 'apellido', header: 'Apellido' },
      { field: 'telefono', header: 'Telefono' },
      { field: 'direccion', header: 'Direccion' },
      { field: 'barrio', header: 'Barrio' },
      { field: 'fechaNacimiento', header: 'Fecha de Nacimiento' }
    ];
  }

  // ***********
  // *** GET ***
  // ***********
  getPacientes() {
    this.hoy = new Date(Date.now()).toLocaleString().slice(0, 14);
    this.pacienteService.getPacientes()
      .then(pacientes => {
        this.pacientes = pacientes;
      });
  }

  // ***************
  // *** AGREGAR ***
  // ***************
  cargarPaciente(f: NgForm) {
    this.pacienteService.cargarPaciente(this.model.dniPaciente, this.model.nombrePaciente, this.model.apellidoPaciente,
      this.model.telefonoPaciente, this.model.direccionPaciente, this.model.barrioPaciente, this.model.fechaNacimientoPaciente)
      .then(pacienteAgregado => {
        // cierro el modal
        this.cerrarAgregar.nativeElement.click();

        // Muestro un mensajito de Agregado con Éxito
        Swal.fire({
          type: 'success',
          title: 'Agregado!',
          text: 'Se ha creado el paciente correctamente.',
          showConfirmButton: false,
          timer: 1500
        });

        // Agrego el Médico al Arreglo de Médicos (actualiza la tabla)
        this.pacientes.push(pacienteAgregado);

        // Reseteo el formulario/modal para que no haya nada en los input cuando se vuelva a abrir
        this.model = {};
        f.resetForm();
      });
  }
}

