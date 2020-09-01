import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { Paciente } from '../../paciente';
import { PacienteService } from '../../paciente.service';
import { ObraService } from '../../../obraSocial/obraSocial.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { ObraSocial } from '../../../obraSocial/obraSocial';


@Component({
  selector: 'app-asignar-obra-social',
  templateUrl: './asignar_obra.component.html',
  animations: [routerTransition()]
})
export class AsignarObraComponent implements OnInit {
  @Input() idPaciente: string;
  @Input() obrasPaciente: ObraSocial[];

  @ViewChild('cerrarAsignar') cerrarAsignar: ElementRef;

  model: any = {};

  colsObras: any[];
  colsObrasNoAsignadas: any;
  selectedObraSocial: ObraSocial;
  selectedObraSociales: ObraSocial;
  obrasNoAsignadas: ObraSocial[];
  idsObras = [];

  constructor(
    private pacienteService: PacienteService,
    private obraSocialService: ObraService
  ) { }


  ngOnInit() {
    this.getObrasNoAsignadas();

    this.colsObras = [
      { field: 'cuit', header: 'Cuit' },
      { field: 'nombre', header: 'Nombre' },
      { field: 'direccion', header: 'Direccion' },
      { field: 'telefono', header: 'Telefono' },
      { field: 'email', header: 'Email' }
    ];

    this.colsObrasNoAsignadas = [
      { field: 'cuit', header: 'Cuit' },
      { field: 'nombre', header: 'Nombre' }
    ];
  }

  // ***********
  // *** GET ***
  // ***********
  getObrasNoAsignadas() {
    this.obraSocialService.getObrasNoAsignadas(this.idPaciente)
      .then(obrasNoAsignadas => {
        this.obrasNoAsignadas = obrasNoAsignadas;
      });
  }

  // ***************
  // *** ASIGNAR ***
  // ***************
  asignarObras() {
    this.pacienteService.asignarObras(this.idPaciente, this.idsObras)
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

        for (const obraAgregada of medicosAgregados) {
          this.obrasPaciente.push(obraAgregada);
        }

        for (const obraAgregada of medicosAgregados) {
          let i = 0;
          for (const medicoNoAsignado of this.obrasNoAsignadas) {
            if (obraAgregada._id === medicoNoAsignado._id) {
              this.obrasNoAsignadas.splice(i, 1);
            }
            i++;
          }
        }

        this.idsObras = [];
      });
  }

  // **************
  // *** QUITAR ***
  // **************
  quitarObra() {
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
          this.pacienteService.quitarObra(this.idPaciente, this.selectedObraSocial._id)
            .then(obraQuitada => {
              Swal.fire({
                title: 'Quitada!',
                text: 'Obra social quitada correctamente',
                type: 'success',
                showConfirmButton: false,
                timer: 1200
              });
              let i = 0;
              for (const medicoPaciente of this.obrasPaciente) {
                if (medicoPaciente._id === obraQuitada._id) {
                  this.obrasPaciente.splice(i, 1);
                }
                i++;
              }

              this.obrasNoAsignadas.push(obraQuitada);
            });
        }
      });
  }

  // *************
  // *** OTROS ***
  // *************
  agregarIdObra(event: any) {
    this.idsObras.push(event.data._id);
  }

  quitarIdObra(event: any) {
    let i = 0;
    for (const idObra of this.idsObras) {
      if (idObra === event.data._id) {
        this.idsObras.splice(i, 1);
      }
      i++;
    }
  }

}

