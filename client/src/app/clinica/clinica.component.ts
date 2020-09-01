import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { routerTransition } from '../router.animations';
import { Clinica } from './clinica';
import { ClinicaService } from './clinica.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productos',
  templateUrl: './clinica.component.html',
  animations: [routerTransition()]
})
export class ClinicaComponent implements OnInit {
  @ViewChild('cerrarAgregar') cerrarAgregar: ElementRef;

  model: any = {};
  clinicas: Clinica[] = [];
  cols: any[];
  selectedClinica: Clinica;

  constructor(
    private clinicaService: ClinicaService
  ) { }


  ngOnInit() {
    this.getClinicas();

    this.cols = [
      { field: 'cuit', header: 'Cuit' },
      { field: 'nombre', header: 'Nombre' },
      { field: 'direccion', header: 'Direccion' },
      { field: 'telefono', header: 'Telefono' },
      { field: 'email', header: 'Email' }
    ];
  }

  // GET OBRAS
  getClinicas() {
    this.clinicaService.getClinicas()
      .then(clinicas => {
        this.clinicas = clinicas;
      });
  }

  // ***************
  // *** AGREGAR ***
  // ***************
  cargarClinica(f: NgForm) {
    this.clinicaService.cargarClinica(this.model.cuitClinica, this.model.nombreClinica,
       this.model.direccionClinica, this.model.telefonoClinica, this.model.emailClinica)
      .then(clinicaAgregada => {
        // cierro el modal
        this.cerrarAgregar.nativeElement.click();

        // Muestro un mensajito de Agregado con Éxito
        Swal.fire({
          title: 'Agregado!',
          text: 'Se ha creado la clinica correctamente.',
          type: 'success',
          showConfirmButton: false,
          timer: 1200
        });

        // Agrego el Médico al Arreglo de Médicos (actualiza la tabla)
        this.clinicas.push(clinicaAgregada);

        // Reseteo el formulario/modal para que no haya nada en los input cuando se vuelva a abrir
        this.model = {};
        f.resetForm();
      });
  }

  // *************
  // *** OTROS ***
  // *************
  validarCuit(): boolean {
    let cuit = this.model.cuitClinica;
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

