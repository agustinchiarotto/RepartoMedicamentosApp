import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { Medico } from '../../medico';
import { MedicoService } from '../../medico.service';
import { ClinicaService } from '../../../clinica/clinica.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Clinica } from '../../../clinica/clinica';
import { typeWithParameters } from '@angular/compiler/src/render3/util';


@Component({
  selector: 'app-asignar-clinica',
  templateUrl: './asignar_clinica.component.html',
  animations: [routerTransition()]
})
export class AsignarClinicaComponent implements OnInit {
  @Input() idMedico: string;
  @Input() clinicasMedico: Clinica[];

  @ViewChild('cerrarAsignar') cerrarAsignar: ElementRef;

  model: any = {};

  colsClinica: any[];
  colsClinicasNoAsignadas: any;
  selectedClinicas: Clinica[];
  selectedClinica: Clinica;
  idsClinicas = [];
  clinicasNoAsignadas: Clinica[];

  constructor(
    private medicoService: MedicoService,
    private clinicaService: ClinicaService
  ) { }


  ngOnInit() {
    this.getClinicasNoAsignadas();
    this.colsClinica = [
      { field: 'cuit', header: 'CUIT' },
      { field: 'nombre', header: 'Nombre' },
      { field: 'direccion', header: 'Direccion' },
      { field: 'telefono', header: 'Telefono' },
      { field: 'email', header: 'Email' }
    ];

    this.colsClinicasNoAsignadas = [
      { field: 'cuit', header: 'CUIT' },
      { field: 'nombre', header: 'Nombre' },
      { field: 'direccion', header: 'Direccion' }
    ];
  }

  // ***********
  // *** GET ***
  // ***********
  getClinicasNoAsignadas() {
    this.clinicaService.getClinicasNoAsignadas(this.idMedico)
      .then(clinicasNoAsignadas => {
        this.clinicasNoAsignadas = clinicasNoAsignadas;
      });
  }

  // ***************
  // *** ASIGNAR ***
  // ***************
  asignarClinicas() {
    this.medicoService.asignarClinicas(this.idMedico, this.idsClinicas)
      .then(clinicasAgregadas => {
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

        for (const clinicaAgregada of clinicasAgregadas) {
          this.clinicasMedico.push(clinicaAgregada);
        }

        for (const clinicaAgregada of clinicasAgregadas) {
          let i = 0;
          for (const medicoNoAsignado of this.clinicasNoAsignadas) {
            if (clinicaAgregada._id === medicoNoAsignado._id) {
              this.clinicasNoAsignadas.splice(i, 1);
            }
            i++;
          }
        }

        this.idsClinicas = [];
      });
  }

  // **************
  // *** QUITAR ***
  // **************
  quitarClinica() {
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
          this.medicoService.quitarClinica(this.idMedico, this.selectedClinica._id)
            .then(clinicaQuitada => {
              Swal.fire(
                'Eliminado!',
                'Medico eliminado correctamente',
                'success'
              );
              let i = 0;
              for (const clinicaMedico of this.clinicasMedico) {
                if (clinicaMedico._id === clinicaQuitada._id) {
                  this.clinicasMedico.splice(i, 1);
                }
                i++;
              }

              this.clinicasNoAsignadas.push(clinicaQuitada);
            });
        }
      });
  }

  // *************
  // *** OTROS ***
  // *************
  agregarIdClinica(event: any) {
    this.idsClinicas.push(event.data._id);
  }

  quitarIdClinica(event: any) {
    let i = 0;
    for (const idClinica of this.idsClinicas) {
      if (idClinica === event.data._id) {
        this.idsClinicas.splice(i, 1);
      }
      i++;
    }
  }
}
