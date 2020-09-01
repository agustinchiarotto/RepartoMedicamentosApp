import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MedicoService } from '../medico.service';
import { Medico } from '../medico';
import { MenuItem } from 'primeng/api';
import { Paciente } from 'src/app/paciente/paciente';
import { Clinica } from 'src/app/clinica/clinica';

@Component({
    selector: 'app-medico-detalle',
    templateUrl: './medicoDetalle.component.html'
})
export class MedicoDetalleComponent implements OnInit {
    @ViewChild('cerrarAgregar') cerrarAgregar: ElementRef;

    model: any;
    colsClinica: any;
    colsPaciente: any;
    items: MenuItem[];
    medico: Medico;
    medicosMedico: Medico[];

    clinicasMedico: Clinica[];
    pacientesMedico: Paciente[];

    editar = false;
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private medicoService: MedicoService
    ) { }

    ngOnInit() {
        this.getMedico();

        this.items = [
            { label: 'Stats', icon: 'fa fa-fw fa-bar-chart' },
            { label: 'Calendar', icon: 'fa fa-fw fa-calendar' },
            { label: 'Documentation', icon: 'fa fa-fw fa-book' },
            { label: 'Support', icon: 'fa fa-fw fa-support' },
            { label: 'Social', icon: 'fa fa-fw fa-twitter' }
        ];

        this.colsClinica = [
            { field: 'cuit', header: 'Cuit' },
            { field: 'nombre', header: 'Nombre' },
            { field: 'telefono', header: 'Telefono' },
            { field: 'direccion', header: 'Direccion' },
            { field: 'email', header: 'Email' },
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
    getMedico(): void {
        this.route.params.forEach((params: Params) => {
            const id = params.idMedico;
            this.medicoService.getMedico(id)
                .then(medico => {
                    this.medico = medico;
                    this.model = medico;
                    this.clinicasMedico = medico.clinicas;
                    this.pacientesMedico = medico.pacientes;
                });
        });
    }

    // ******************
    // *** ACTUALIZAR ***
    // ******************
    actualizarMedico(): void {
        this.medicoService
            .editarMedico(this.medico._id, this.medico.nombre, this.medico.apellido,
                this.medico.telefono, this.medico.matricula, this.medico.especialidad)
            .then(medicoActualizado => {
                // Mensaje de Éxito
                Swal.fire({
                    title: 'Actualizado!',
                    text: 'Se ha actualizado el medico correctamente.',
                    type: 'success',
                    showConfirmButton: false,
                    timer: 1200
                });
                this.medico = medicoActualizado;
                this.editar = false;
            });
    }

    // ****************
    // *** ELIMINAR ***
    // ****************
    eliminarMedico() {
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
                    this.medicoService.deleteMedico(this.medico._id)
                        .then(medicoEliminado => {
                            Swal.fire(
                                'Eliminado!',
                                'Medico eliminado correctamente',
                                'success'
                            );
                            this.router.navigate(['/medicos']);
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
}
