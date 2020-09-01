import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ClinicaService } from '../clinica.service';
import { Clinica } from '../clinica';
import { Medico } from 'src/app/medico/medico';

@Component({
    selector: 'app-obra-social-detalle',
    templateUrl: './clinicaDetalle.component.html'
})
export class ClinicaDetalleComponent implements OnInit {
    @ViewChild('cerrarAgregar') cerrarAgregar: ElementRef;

    model: any = {};
    colsMedico: any;
    clinica: Clinica;

    medicosClinica: Medico[];

    editar = false;
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private clinicaService: ClinicaService
    ) { }

    ngOnInit() {
        this.getClinica();
        this.colsMedico = [
            { field: 'dni', header: 'DNI' },
            { field: 'nombre', header: 'Nombre' },
            { field: 'apellido', header: 'Apellido' },
            { field: 'matricula', header: 'Matricula' },
            { field: 'matricula', header: 'Telefono' },
            { field: 'matricula', header: 'Especialidad' }
        ];
    }

    // ***********
    // *** GET ***
    // ***********
    getClinica(): void {
        this.route.params.forEach((params: Params) => {
            const id = params.idClinica;
            this.clinicaService.getClinica(id)
                .then(clinica => {
                    this.clinica = clinica;
                    this.medicosClinica = clinica.medicos;
                });
        });
    }

    // ******************
    // *** ACTUALIZAR ***
    // ******************
    actualizarClinica(): void {
        this.clinicaService
            .editarClinica(this.clinica._id, this.clinica.cuit, this.clinica.nombre, this.clinica.direccion,
                this.clinica.telefono, this.clinica.email)
            .then(clinicaActualizado => {
                // Mensaje de Éxito
                Swal.fire({
                    title: 'Actualizado!',
                    text: 'Se ha actualizado el clinica correctamente.',
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
    eliminarClinica() {
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
                    this.clinicaService.deleteClinica(this.clinica._id)
                        .then(clinicaEliminado => {
                            Swal.fire(
                                'Eliminado!',
                                'Clinica eliminado correctamente',
                                'success'
                            );
                            this.router.navigate(['/clinicas']);
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
        let cuit = this.clinica.cuit;
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
