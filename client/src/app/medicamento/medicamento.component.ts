import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { routerTransition } from '../router.animations';
import { Medicamento } from './medicamento';
import { MedicamentoService } from './medicamento.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productos',
  templateUrl: './medicamento.component.html',
  animations: [routerTransition()]
})
export class MedicamentoComponent implements OnInit {
  @ViewChild('cerrarAgregar') cerrarAgregar: ElementRef;
  @ViewChild('cerrarEditar') cerrarEditar: ElementRef;

  model: any = {};
  medicamentos: Medicamento[] = [];
  cols: any[];
  selectedMedicamento: Medicamento;
  modalAgregarMedicamento = false;
  modalEditarMedicamento = false;
  modalEliminarMedicamento = false;
  cadenaFrio = '';


  constructor(
    private medicamentoService: MedicamentoService
  ) { }


  ngOnInit() {
    this.getMedicamentos();

    this.cols = [
      { field: 'idMedicamento', header: 'Codigo' },
      { field: 'nombre', header: 'Nombre' },
      { field: 'dosis', header: 'Dosis' },
      { field: 'cadenaFrio', header: 'Cadena Frio' },
      { field: 'laboratorio', header: 'Laboratorio' },
      { field: 'cantidadComprimidos', header: 'Cantidad Comprimidos' }
    ];
  }

  // ***********
  // *** GET ***
  // ***********
  getMedicamentos() {
    this.medicamentoService.getMedicamentos()
      .then(medicamentos => {
        this.medicamentos = medicamentos;
      });
  }

  // ***************
  // *** AGREGAR ***
  // ***************
  cargarMedicamento(cadenaFrio: string, f: NgForm) {
    this.modalAgregarMedicamento = false;
    this.medicamentoService.cargarMedicamento(
      this.model.nombreMedicamento,
      this.model.dosisMedicamento,
      cadenaFrio,
      this.model.laboratorioMedicamento,
      this.model.cantidadComprimidosMedicamento)
      .then(medicamentoAgregado => {
        // cierro el modal
        this.cerrarAgregar.nativeElement.click();

        // Muestro un mensajito de Agregado con Éxito
        Swal.fire({
          title: 'Agregado!',
          text: 'Se ha creado el medicamento correctamente.',
          type: 'success',
          showConfirmButton: false,
          timer: 1200
        });

        // Agrego el Médico al Arreglo de Médicos (actualiza la tabla)
        this.medicamentos.push(medicamentoAgregado);

        // Reseteo el formulario/modal para que no haya nada en los input cuando se vuelva a abrir
        this.model = {};
        f.resetForm();
      });
  }

  // ******************
  // *** ACTUALIZAR ***
  // ******************
  editarMedicamento(f: NgForm) {
    this.medicamentoService.editarMedicamento(this.selectedMedicamento._id,
      this.selectedMedicamento.nombre,
      this.selectedMedicamento.dosis,
      this.selectedMedicamento.cadenaFrio,
      this.selectedMedicamento.laboratorio,
      this.selectedMedicamento.cantidadComprimidos)
      .then(medicamentoEditado => {
        // cierro el modal
        this.cerrarEditar.nativeElement.click();

        // Muestro un mensajito de Actualizado con Éxito
        Swal.fire({
          title: 'Actualizado!',
          text: 'Se ha actualizado el medicamento correctamente.',
          type: 'success',
          showConfirmButton: false,
          timer: 1200
        });

        // PARA ACTUALIZAR VISTA (TABLA)
        this.medicamentos.forEach(elementoMedicamento => {
          if (elementoMedicamento._id === medicamentoEditado._id) {
            elementoMedicamento = medicamentoEditado;
          }
        });

        // Reseteo el selectedMedicamento y el formulario de editar
        this.selectedMedicamento = null;
        f.resetForm();
      });
  }

  // ****************
  // *** ELIMINAR ***
  // ****************
  eliminarMedicamento() {
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
          this.medicamentoService.deleteMedicamento(this.selectedMedicamento._id)
            .then(medicamentoEliminado => {
              Swal.fire({
                title: 'Eliminado!',
                text: 'Medicamento eliminado correctamente',
                type: 'success',
                showConfirmButton: false,
                timer: 1200
              });
              // Elimino el medico del arreglo de medicos (actualiza la tabla)
              let i;

              // Con el forEach busco la posicion (index) del medico eliminado
              this.medicamentos.forEach((medicamento, index) => {
                if (medicamento._id === medicamentoEliminado._id) {
                  i = index;
                }
              });

              // 'splice' corta el arreglo justo en el indice 'i'
              this.medicamentos.splice(i, 1);

              // Reseteo el medico seleccionado a null
              this.selectedMedicamento = null;
            });
        } else {
          // Reseteo el medico seleccionado a null
          this.selectedMedicamento = null;
        }
      });

  }

  mostrarModalAgregarMedicamento() {
    this.modalAgregarMedicamento = true;
  }

  mostrarModalEditar() {
    if (this.selectedMedicamento != null) {
      this.modalEditarMedicamento = true;
    }

  }

  cerrarModalEditar() {
    this.modalEditarMedicamento = false;
  }
}

