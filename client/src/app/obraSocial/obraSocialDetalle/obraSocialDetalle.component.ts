import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ObraService } from '../obraSocial.service';
import { ObraSocial } from '../obraSocial';
import { MenuItem } from 'primeng/api';
import { Paciente } from 'src/app/paciente/paciente';
import { Clinica } from 'src/app/clinica/clinica';

@Component({
    selector: 'app-obra-social-detalle',
    templateUrl: './obraSocialDetalle.component.html'
})
export class ObraSocialDetalleComponent implements OnInit {
    @ViewChild('cerrarAgregar') cerrarAgregar: ElementRef;

    model: any = {};
    colsPaciente: any;
    items: MenuItem[];
    obraSocial: ObraSocial;

    pacientesObraSocial: Paciente[];

    editar = false;
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private obraSocialService: ObraService
    ) { }

    ngOnInit() {
        this.getObraSocial();

        this.items = [
            { label: 'Stats', icon: 'fa fa-fw fa-bar-chart' },
            { label: 'Calendar', icon: 'fa fa-fw fa-calendar' },
            { label: 'Documentation', icon: 'fa fa-fw fa-book' },
            { label: 'Support', icon: 'fa fa-fw fa-support' },
            { label: 'Social', icon: 'fa fa-fw fa-twitter' }
        ];

        this.colsPaciente = [
            { field: 'dni', header: 'DNI' },
            { field: 'nombre', header: 'Nombre' },
            { field: 'apellido', header: 'Apellido' },
            { field: 'telefono', header: 'Telefono' },
            { field: 'direccion', header: 'Direccion' },
            { field: 'barrio', header: 'Barrio' },
            { field: 'fechaNacimiento', header: 'Fecha de Nacimiento' }
        ];
    }

    // ***********
    // *** GET ***
    // ***********
    getObraSocial(): void {
        this.route.params.forEach((params: Params) => {
            const id = params.idObraSocial;
            this.obraSocialService.getObraSocial(id)
                .then(obraSocial => {
                    this.obraSocial = obraSocial;
                    this.pacientesObraSocial = obraSocial.pacientes;
                });
        });
    }

    // ******************
    // *** ACTUALIZAR ***
    // ******************
    actualizarObraSocial(): void {
        this.obraSocialService
            .editarObraSocial(this.obraSocial._id, this.obraSocial.cuit, this.obraSocial.nombre, this.obraSocial.direccion,
                this.obraSocial.telefono, this.obraSocial.email)
            .then(obraSocialActualizado => {
                // Mensaje de Éxito
                Swal.fire({
                    title: 'Actualizado!',
                    text: 'Se ha actualizado el obraSocial correctamente.',
                    type: 'success',
                    showConfirmButton: false,
                    timer: 1200
                });

                this.editar = false;
            });
    }

    // ****************
    // *** ELIMINAR ***
    // ****************
    eliminarObraSocial() {
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
                    this.obraSocialService.deleteObraSocial(this.obraSocial._id)
                        .then(obraSocialEliminado => {
                            Swal.fire(
                                'Eliminado!',
                                'Obra Social eliminada correctamente',
                                'success'
                            );
                            this.router.navigate(['/obras']);
                        });
                }
            });
    }

    // *************
    // *** OTROS ***
    // *************
    toggleEditar() {
        this.editar = !this.editar;
    }

    validarCuit(): boolean {
        let cuit = this.obraSocial.cuit;
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
