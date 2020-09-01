import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { Paciente } from '../../paciente';
import { PacienteService } from '../../paciente.service';
import { MedicoService } from '../../../medico/medico.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Medico } from '../../../medico/medico';
import { typeWithParameters } from '@angular/compiler/src/render3/util';


@Component({
  selector: 'app-asignar-medico',
  templateUrl: './asignar_medico.component.html',
  animations: [routerTransition()]
})
export class AsignarMedicoComponent implements OnInit {
  @Input() idPaciente: string;
  @Input() medicosPaciente: Medico[];

  @ViewChild('cerrarAsignar') cerrarAsignar: ElementRef;

  model: any = {};

  colsMedico: any[];
  colsMedicosNoAsignados: any;
  selectedMedicos: Medico[];
  selectedMedico: Medico;
  idsMedicos = [];
  medicosNoAsignados: Medico[];

  constructor(
    private pacienteService: PacienteService,
    private medicoService: MedicoService
  ) { }


  ngOnInit() {
    this.getMedicosNoAsignados();
    this.colsMedico = [
      { field: 'dni', header: 'DNI' },
      { field: 'nombre', header: 'Nombre' },
      { field: 'apellido', header: 'Apellido' },
      { field: 'telefono', header: 'Telefono' },
      { field: 'matricula', header: 'Matricula' }
    ];

    this.colsMedicosNoAsignados = [
      { field: 'dni', header: 'DNI' },
      { field: 'nombre', header: 'Nombre' },
      { field: 'apellido', header: 'Apellido' }
    ];
  }

  // ***********
  // *** GET ***
  // ***********
  getMedicosNoAsignados() {
    this.medicoService.getMedicosNoAsignados(this.idPaciente)
      .then(medicosNoAsignados => {
        this.medicosNoAsignados = medicosNoAsignados;
      });
  }

  // ***************
  // *** ASIGNAR ***
  // ***************
  asignarMedicos() {
    this.pacienteService.asignarMedicos(this.idPaciente, this.idsMedicos)
      .then(medicosAgregados => {
        // cierro el modal
        this.cerrarAsignar.nativeElement.click();

        // Muestro un mensajito de Actualizado con Éxito
        Swal.fire({
          title: 'Actualizado!',
          text: 'Se ha asignado el médico correctamente.',
          type: 'success',
          showConfirmButton: false,
          timer: 1200
        });

        for (const medicoAgregado of medicosAgregados) {
          this.medicosPaciente.push(medicoAgregado);
        }

        for (const medicoAgregado of medicosAgregados) {
          let i = 0;
          for (const medicoNoAsignado of this.medicosNoAsignados) {
            if (medicoAgregado._id === medicoNoAsignado._id) {
              this.medicosNoAsignados.splice(i, 1);
            }
            i++;
          }
        }

        this.idsMedicos = [];
      });
  }

  // **************
  // *** QUITAR ***
  // **************
  quitarMedico() {
    // Mensajito: ¿ESTAS SEGURO?
    Swal.fire({
      title: 'Estas seguro?',
      text: 'Esta acción no se puede revertir!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    })
      .then((willDelete) => {
        if (willDelete.value) {
          // SI ACEPTA
          this.pacienteService.quitarMedico(this.idPaciente, this.selectedMedico._id)
            .then(medicoQuitado => {
              Swal.fire({
                title: 'Quitado!',
                text: 'Medico quitado correctamente',
                type: 'success',
                showConfirmButton: false,
                timer: 1200
              });
              let i = 0;
              for (const medicoPaciente of this.medicosPaciente) {
                if (medicoPaciente._id === medicoQuitado._id) {
                  this.medicosPaciente.splice(i, 1);
                }
                i++;
              }

              this.medicosNoAsignados.push(medicoQuitado);
            });
        }
      });
  }

  // *************
  // *** OTROS ***
  // *************
  agregarIdMedico(event: any) {
    this.idsMedicos.push(event.data._id);
  }

  quitarIdMedico(event: any) {
    let i = 0;
    for (const idMedico of this.idsMedicos) {
      if (idMedico === event.data._id) {
        this.idsMedicos.splice(i, 1);
      }
      i++;
    }
  }
}

