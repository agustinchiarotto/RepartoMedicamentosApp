import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PacienteService } from '../paciente.service';
import { Paciente } from '../paciente';
import { Medico } from 'src/app/medico/medico';

@Component({
    selector: 'app-contrato-detalle',
    templateUrl: './pacienteDetalle.component.html'
})
export class PacienteDetalleComponent implements OnInit {
    @ViewChild('cerrarAgregar') cerrarAgregar: ElementRef;

    model: any = {};
    colsMedico: any;
    paciente: Paciente;

    medicosPaciente: Medico[];

    editar = false;
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private pacienteService: PacienteService
    ) { }

    ngOnInit() {
        this.getPaciente();
        this.colsMedico = [
            { field: 'dni', header: 'DNI' },
            { field: 'nombre', header: 'Nombre' },
            { field: 'apellido', header: 'Apellido' },
            { field: 'matricula', header: 'Matricula' },
            { field: 'Telefono', header: 'Telefono' },
            { field: 'Especialidad', header: 'Especialidad' }
        ];
    }

    // ***********
    // *** GET ***
    // ***********
    getPaciente(): void {
        this.route.params.forEach((params: Params) => {
            const id = params.idPaciente;
            this.pacienteService.getPaciente(id)
                .then(paciente => {
                    this.paciente = paciente;
                    this.medicosPaciente = paciente.medicos;
                });
        });
    }

    // ******************
    // *** ACTUALIZAR ***
    // ******************
    actualizarPaciente(): void {
        this.pacienteService
            .editarPaciente(this.paciente._id, this.paciente.nombre, this.paciente.apellido,
                this.paciente.telefono, this.paciente.direccion, this.paciente.barrio, this.paciente.fechaNacimiento)
            .then(pacienteActualizado => {
                // Mensaje de Éxito
                Swal.fire({
                    title: 'Actualizado!',
                    text: 'Se ha actualizado el paciente correctamente.',
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
    eliminarPaciente() {
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
                    this.pacienteService.deletePaciente(this.paciente._id)
                        .then(pacienteEliminado => {
                            Swal.fire(
                                'Eliminado!',
                                'Paciente eliminado correctamente',
                                'success'
                            );
                            this.router.navigate(['/pacientes']);
                        });
                }
            });
    }

    // *************
    // *** OTROS ***
    // *************
    toggleEditar() {
        this.editar = true;
    }
}
