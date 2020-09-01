import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { routerTransition } from '../router.animations';
import { Repartidor } from './repartidor';
import { RepartidorService } from './repartidor.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productos',
  templateUrl: './repartidor.component.html',
  animations: [routerTransition()]
})
export class RepartidorComponent implements OnInit {
  @ViewChild('cerrarAgregar') cerrarAgregar: ElementRef;
  @ViewChild('cerrarEditar') cerrarEditar: ElementRef;

  model: any = {};
  repartidores: Repartidor[] = [];
  cols: any[];
  selectedRepartidor: Repartidor;
  modalAgregarRepartidor = false;
  modalEditarRepartidor = false;
  modalEliminarRepartidor = false;


  constructor(
    private repartidorService: RepartidorService
  ) { }


  ngOnInit() {
    this.getRepartidores();

    this.cols = [
      { field: 'dni', header: 'DNI' },
      { field: 'nombre', header: 'Nombre' },
      { field: 'apellido', header: 'Apellido' },
      { field: 'telefono', header: 'Telefono' },
      { field: 'legajo', header: 'Legajo' }
    ];
  }

  // ***********
  // *** GET ***
  // ***********
  getRepartidores() {
    this.repartidorService.getRepartidores()
      .then(repartidores => {
        this.repartidores = repartidores;
      });
  }

  // ***************
  // *** AGREGAR ***
  // ***************
  cargarRepartidor(f: NgForm) {
    this.modalAgregarRepartidor = false;
    this.repartidorService.cargarRepartidor(this.model.dni, this.model.nombre,
      this.model.apellido, this.model.telefono, this.model.legajo)
      .then(repartidorAgregado => {
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
        this.repartidores.push(repartidorAgregado);

        // Reseteo el formulario/modal para que no haya nada en los input cuando se vuelva a abrir
        this.model = {};
        f.resetForm();
      });
  }

  // ******************
  // *** ACTUALIZAR ***
  // ******************
  editarRepartidor(f: NgForm) {
    this.repartidorService.editarRepartidor(this.selectedRepartidor._id,
      this.selectedRepartidor.dni,
      this.selectedRepartidor.nombre,
      this.selectedRepartidor.apellido,
      this.selectedRepartidor.telefono,
      this.selectedRepartidor.legajo)
      .then(repartidorEditado => {
        // cierro el modal
        this.cerrarEditar.nativeElement.click();

        // Muestro un mensajito de Actualizado con Éxito
        Swal.fire({
          title: 'Actualizado!',
          text: 'Se ha actualizado el médico correctamente.',
          type: 'success',
          showConfirmButton: false,
          timer: 1200
        });

        // PARA ACTUALIZAR VISTA (TABLA)
        let i = 0;
        this.repartidores.forEach(elementoRepartidor => {
          if (elementoRepartidor._id === repartidorEditado._id) {
            this.repartidores[i] = repartidorEditado;
          }
          i++;
        });

        // Reseteo el selectedRepartidor y el formulario de editar
        f.resetForm();
        this.selectedRepartidor = null;
      });
  }

  // ****************
  // *** ELIMINAR ***
  // ****************
  eliminarRepartidor() {
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
          this.repartidorService.deleteRepartidor(this.selectedRepartidor._id)
            .then(repartidorEliminado => {
              Swal.fire(
                'Eliminado!',
                'Repartidor eliminado correctamente',
                'success'
              );
              // Elimino el repartidor del arreglo de repartidores (actualiza la tabla)
              let i;

              // Con el forEach busco la posicion (index) del repartidor eliminado
              this.repartidores.forEach((repartidor, index) => {
                if (repartidor._id === repartidorEliminado._id) {
                  i = index;
                }
              });

              // 'splice' corta el arreglo justo en el indice 'i'
              this.repartidores.splice(i, 1);

              // Reseteo el repartidor seleccionado a null
              this.selectedRepartidor = null;
            });
        } else {
          // Reseteo el repartidor seleccionado a null
          this.selectedRepartidor = null;
        }
      });

  }

  mostrarModalAgregarRepartidor() {
    this.modalAgregarRepartidor = true;
  }

  mostrarModalEditar() {
    if (this.selectedRepartidor != null) {
      this.modalEditarRepartidor = true;
    }

  }


  cerrarModalEliminar() {
    this.modalEliminarRepartidor = false;
  }

  cerrarModalAgregar() {
    this.modalAgregarRepartidor = false;
  }

}

