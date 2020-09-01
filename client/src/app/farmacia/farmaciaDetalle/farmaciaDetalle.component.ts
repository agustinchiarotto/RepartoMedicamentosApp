import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FarmaciaService } from '../farmacia.service';
import { Farmacia } from '../farmacia';
import { Medicamento } from 'src/app/medicamento/medicamento';

@Component({
    selector: 'app-obra-social-detalle',
    templateUrl: './farmaciaDetalle.component.html'
})
export class FarmaciaDetalleComponent implements OnInit {
    @ViewChild('cerrarAgregar') cerrarAgregar: ElementRef;

    model: any = {};
    colsMedicamento: any;
    farmacia: Farmacia;

    medicamentosFarmacia: Medicamento[];

    editar = false;
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private farmaciaService: FarmaciaService
    ) { }

    ngOnInit() {
        this.getFarmacia();
        this.colsMedicamento = [
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
    getFarmacia(): void {
        this.route.params.forEach((params: Params) => {
            const id = params.idFarmacia;
            this.farmaciaService.getFarmacia(id)
                .then(farmacia => {
                    this.farmacia = farmacia;
                    this.medicamentosFarmacia = farmacia.medicamentos;
                });
        });
    }

    // ******************
    // *** ACTUALIZAR ***
    // ******************
    actualizarFarmacia(): void {
        this.farmaciaService
            .editarFarmacia(this.farmacia._id, this.farmacia.cuit, this.farmacia.nombre, this.farmacia.direccion,
                this.farmacia.telefono, this.farmacia.email)
            .then(farmaciaActualizado => {
                // Mensaje de Éxito
                Swal.fire({
                    title: 'Actualizado!',
                    text: 'Se ha actualizado el farmacia correctamente.',
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
    eliminarFarmacia() {
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
                    this.farmaciaService.deleteFarmacia(this.farmacia._id)
                        .then(farmaciaEliminado => {
                            Swal.fire(
                                'Eliminado!',
                                'Farmacia eliminado correctamente',
                                'success'
                            );
                            this.router.navigate(['/farmacias']);
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
        let cuit = this.farmacia.cuit;
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
