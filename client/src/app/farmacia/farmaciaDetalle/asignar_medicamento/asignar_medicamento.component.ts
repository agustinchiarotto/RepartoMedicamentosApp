import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { Farmacia } from '../../farmacia';
import { FarmaciaService } from '../../farmacia.service';
import { MedicamentoService } from '../../../medicamento/medicamento.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Medicamento } from '../../../medicamento/medicamento';
import { typeWithParameters } from '@angular/compiler/src/render3/util';


@Component({
  selector: 'app-asignar-medicamento',
  templateUrl: './asignar_medicamento.component.html',
  animations: [routerTransition()]
})
export class AsignarMedicamentoComponent implements OnInit {
  @Input() idFarmacia: string;
  @Input() medicamentosFarmacia: Medicamento[];

  @ViewChild('cerrarAsignar') cerrarAsignar: ElementRef;

  model: any = {};

  colsMedicamento: any[];
  colsMedicamentosNoAsignados: any;
  selectedMedicamentos: Medicamento[];
  selectedMedicamento: Medicamento;
  idsMedicamentos = [];
  medicamentosNoAsignados: Medicamento[];

  constructor(
    private farmaciaService: FarmaciaService,
    private medicamentoService: MedicamentoService
  ) { }


  ngOnInit() {
    this.getMedicamentosNoAsignados();
    this.colsMedicamento = [
      { field: 'idMedicamento', header: 'Codigo' },
      { field: 'nombre', header: 'Nombre' },
      { field: 'dosis', header: 'Dosis' },
      { field: 'cadenaFrio', header: 'Cadena Frio' },
      { field: 'laboratorio', header: 'Laboratorio' },
      { field: 'cantidadComprimidos', header: 'Cantidad Comprimidos' }
    ];

    this.colsMedicamentosNoAsignados = [
      { field: 'idMedicamento', header: 'Id Medicamento' },
      { field: 'nombre', header: 'Nombre' },
      { field: 'dosis', header: 'Dosis' }
    ];
  }

  // ***********
  // *** GET ***
  // ***********
  getMedicamentosNoAsignados() {
    this.medicamentoService.getMedicamentosNoFarmacia(this.idFarmacia)
      .then(medicamentosNoAsignados => {
        this.medicamentosNoAsignados = medicamentosNoAsignados;
      });
  }

  // ***************
  // *** ASIGNAR ***
  // ***************
  asignarMedicamentos() {
    this.farmaciaService.asignarMedicamentos(this.idFarmacia, this.idsMedicamentos)
      .then(medicamentosAgregados => {
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

        for (const medicamentoAgregado of medicamentosAgregados) {
          this.medicamentosFarmacia.push(medicamentoAgregado);
        }

        for (const medicamentoAgregado of medicamentosAgregados) {
          let i = 0;
          for (const medicamentoNoAsignado of this.medicamentosNoAsignados) {
            if (medicamentoAgregado._id === medicamentoNoAsignado._id) {
              this.medicamentosNoAsignados.splice(i, 1);
            }
            i++;
          }
        }

        this.idsMedicamentos = [];
      });
  }

  // **************
  // *** QUITAR ***
  // **************
  quitarMedicamento() {
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
          this.farmaciaService.quitarMedicamento(this.idFarmacia, this.selectedMedicamento._id)
            .then(medicamentoQuitado => {
              Swal.fire({
                title: 'Quitado!',
                text: 'Medicamento quitado correctamente',
                type: 'success',
                showConfirmButton: false,
                timer: 1200
              });
              let i = 0;
              for (const medicamentoFarmacia of this.medicamentosFarmacia) {
                if (medicamentoFarmacia._id === medicamentoQuitado._id) {
                  this.medicamentosFarmacia.splice(i, 1);
                }
                i++;
              }
              this.medicamentosNoAsignados.push(medicamentoQuitado);
              this.selectedMedicamento = null;
            });
        }
      });
  }

  // *************
  // *** OTROS ***
  // *************
  agregarIdMedicamento(event: any) {
    this.idsMedicamentos.push(event.data._id);
  }

  quitarIdMedicamento(event: any) {
    let i = 0;
    for (const idMedicamento of this.idsMedicamentos) {
      if (idMedicamento === event.data._id) {
        this.idsMedicamentos.splice(i, 1);
      }
      i++;
    }
  }
}

