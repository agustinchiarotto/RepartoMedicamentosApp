import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { routerTransition } from '../router.animations';
import { ObraSocial } from './obraSocial';
import { ObraService } from './obraSocial.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productos',
  templateUrl: './obraSocial.component.html',
  animations: [routerTransition()]
})
export class ObraSocialComponent implements OnInit {
  @ViewChild('cerrarAgregar') cerrarAgregar: ElementRef;

  model: any = {};
  obra: ObraSocial[] = [];
  cols: any[];
  selectedObra: ObraSocial;

  constructor(
    private obraSocialService: ObraService
  ) { }


  ngOnInit() {
    this.getObras();

    this.cols = [
      { field: 'cuit', header: 'Cuit' },
      { field: 'nombre', header: 'Nombre' },
      { field: 'direccion', header: 'Direccion' },
      { field: 'telefono', header: 'Telefono' },
      { field: 'email', header: 'Email' }
    ];
  }

  // GET OBRAS
  getObras() {
    this.obraSocialService.getObras()
      .then(obras => {
        this.obra = obras;
      });
  }

  // ***************
  // *** AGREGAR ***
  // ***************
  cargarObraSocial(f: NgForm) {
    this.obraSocialService.cargarObra(this.model.cuitObra, this.model.nombreObra,
       this.model.direccionObra, this.model.telefonoObra, this.model.emailObra)
      .then(obraAgregada => {
        // cierro el modal
        this.cerrarAgregar.nativeElement.click();

        // Muestro un mensajito de Agregado con Éxito
        Swal.fire({
          title: 'Agregado!',
          text: 'Se ha creado la obra social correctamente.',
          type: 'success',
          showConfirmButton: false,
          timer: 1200
        });

        // Agrego el Médico al Arreglo de Médicos (actualiza la tabla)
        this.obra.push(obraAgregada);

        // Reseteo el formulario/modal para que no haya nada en los input cuando se vuelva a abrir
        f.resetForm();
      });
  }

  // *************
  // *** OTROS ***
  // *************
  validarCuit(): boolean {
    let cuit = this.model.cuitObra;
    cuit = cuit.replace(/[^0-9]/g, '');

    if (cuit.length !== 11) {
        return true;
    }

    let acumulado   = 0;
    const digitos     = cuit.split('');
    const digito      = digitos.pop();

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

