import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { routerTransition } from '../router.animations';
import { Medico } from './medico';
import { MedicoService } from './medico.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productos',
  templateUrl: './medico.component.html',
  animations: [routerTransition()]
})
export class MedicoComponent implements OnInit {
  @ViewChild('cerrarAgregar') cerrarAgregar: ElementRef;

  model: any = {};
  medicos: Medico[];
  cols: any[];
  selectedMedico: Medico;

  constructor(
    private medicoService: MedicoService
  ) { }


  ngOnInit() {
    this.getMedicos();
    this.cols = [
      { field: 'dni', header: 'DNI' },
      { field: 'nombre', header: 'Nombre' },
      { field: 'apellido', header: 'Apellido' },
      { field: 'telefono', header: 'Telefono' },
      { field: 'matricula', header: 'Matricula' },
      { field: 'especialidad', header: 'Especialidad' }
    ];
  }

  // ***********
  // *** GET ***
  // ***********
  getMedicos() {
    this.medicoService.getMedicos()
      .then(medicos => {
        this.medicos = medicos;
      });
  }

  // ***************
  // *** AGREGAR ***
  // ***************
  cargarMedico(f: NgForm) {
    this.medicoService.cargarMedico(this.model.dniMedico, this.model.nombreMedico, this.model.apellidoMedico,
      this.model.telefonoMedico, this.model.matriculaMedico, this.model.especialidadMedico)
      .then(medicoAgregado => {
        // cierro el modal
        this.cerrarAgregar.nativeElement.click();

        // Muestro un mensajito de Agregado con Éxito
        Swal.fire({
          title: 'Agregado!',
          text: 'Se ha creado el médico correctamente.',
          type: 'success',
          showConfirmButton: false,
          timer: 1200
        });

        // Agrego el Médico al Arreglo de Médicos (actualiza la tabla)
        this.medicos.push(medicoAgregado);

        // Reseteo el formulario/modal para que no haya nada en los input cuando se vuelva a abrir
        f.resetForm();
      });
  }
}

