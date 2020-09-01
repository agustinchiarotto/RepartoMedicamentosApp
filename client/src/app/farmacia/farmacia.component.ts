import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { routerTransition } from '../router.animations';
import { Farmacia } from './farmacia';
import { FarmaciaService } from './farmacia.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productos',
  templateUrl: './farmacia.component.html',
  animations: [routerTransition()]
})
export class FarmaciaComponent implements OnInit {
  @ViewChild('cerrarAgregar') cerrarAgregar: ElementRef;

  model: any = {};
  farmacias: Farmacia[] = [];
  cols: any[];
  selectedFarmacia: Farmacia;

  constructor(
    private farmaciaService: FarmaciaService
  ) { }


  ngOnInit() {
    this.getFarmacias();

    this.cols = [
      { field: 'cuit', header: 'Cuit' },
      { field: 'nombre', header: 'Nombre' },
      { field: 'direccion', header: 'Direccion' },
      { field: 'telefono', header: 'Telefono' },
      { field: 'email', header: 'Email' }
    ];
  }

  // GET OBRAS
  getFarmacias() {
    this.farmaciaService.getFarmacias()
      .then(farmacias => {
        this.farmacias = farmacias;
      });
  }

  // ***************
  // *** AGREGAR ***
  // ***************
  cargarFarmacia(f: NgForm) {
    this.farmaciaService.cargarFarmacia(this.model.cuitFarmacia, this.model.nombreFarmacia,
      this.model.direccionFarmacia, this.model.telefonoFarmacia, this.model.emailFarmacia)
      .then(farmaciaAgregada => {
        // cierro el modal
        this.cerrarAgregar.nativeElement.click();

        // Muestro un mensajito de Agregado con Éxito
        Swal.fire({
          title: 'Agregado!',
          text: 'Se ha creado la farmacia correctamente.',
          type: 'success',
          showConfirmButton: false,
          timer: 1200
        });

        // Agrego el Médico al Arreglo de Médicos (actualiza la tabla)
        this.farmacias.push(farmaciaAgregada);

        // Reseteo el formulario/modal para que no haya nada en los input cuando se vuelva a abrir
        this.model = {};
        f.resetForm();
      });
  }

  // *************
  // *** OTROS ***
  // *************
  validarCuit(): boolean {
    let cuit = this.model.cuitFarmacia;
    cuit = cuit.replace(/[^0-9]/g, '');

    if (cuit.length !== 11) {
      return true;
    }

    let acumulado = 0;
    const digitos = cuit.split('');
    const digito = digitos.pop();

    for (let i = 0; i < digitos.length; i++) {
      acumulado += +digitos[9 - i] * (2 + (i % 6));
    }

    let verif = 11 - (acumulado % 11);
    if (verif === 11) {
      verif = 0;
    } else if (verif === 10) {
      verif = 9;
    }

    if (digito === verif.toString()) {
      return false;
    } else {
      return true;
    }
  }
}
