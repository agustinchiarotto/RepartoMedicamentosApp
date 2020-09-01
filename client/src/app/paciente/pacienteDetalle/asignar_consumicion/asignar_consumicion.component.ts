import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { Paciente } from '../../paciente';
import { PacienteService } from '../../paciente.service';
import { MedicamentoService } from '../../../medicamento/medicamento.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Medicamento } from '../../../medicamento/medicamento';
import { Pedido } from '../../../pedido/pedido';
import { Consumicion } from '../../consumicion';
import { PedidoService } from 'src/app/pedido/pedido.service';


@Component({
  selector: 'app-asignar-consumicion',
  templateUrl: './asignar_consumicion.component.html',
  animations: [routerTransition()]
})
export class AsignarConsumicionComponent implements OnInit {
  @Input() idPaciente: string;
  @Input() consumicionesPaciente: Consumicion[];

  @ViewChild('cerrarAsignar') cerrarAsignar: ElementRef;

  model: any = {};
  colsConsumiciones: any[];

  medicamentosNoConsume: Medicamento[] = [];
  colsMedicamentosNoConsume: any[];
  selectedMedicamento: Medicamento;

  selectedConsumicion: Consumicion;

  constructor(
    private pacienteService: PacienteService,
    private medicamentoService: MedicamentoService,
    private pedidoService: PedidoService
  ) { }


  ngOnInit() {

    this.getMedicamentosNoConsumePaciente();

    this.colsConsumiciones = [
      { field: 'medicamento', header: 'Medicamento' },
      { field: 'frecuencia', header: 'Frecuencia' },
      { field: 'cantidadConsumicion', header: 'Cantidad' },
      { field: 'diasRestantes', header: 'Días Restantes' }
    ];

    this.colsMedicamentosNoConsume = [
      { field: 'idMedicamento', header: 'Id Medicamento' },
      { field: 'nombre', header: 'Nombre' },
      { field: 'dosis', header: 'Dosis' },
      { field: 'cantidadComprimidos', header: 'Comprimidos' }
    ];
  }

  // ***********
  // *** GET ***
  // ***********
  getMedicamentosNoConsumePaciente() {
    this.medicamentoService.getMedicamentosNoConsumePaciente(this.idPaciente)
      .then(medicamentos => {
        this.medicamentosNoConsume = medicamentos;
      });
  }

  // ***************
  // *** ASIGNAR ***
  // ***************
  cargarConsumicion(f: NgForm) {
    this.pacienteService.cargarConsumicion(this.idPaciente,
      this.selectedMedicamento._id,
      this.model.frecuencia,
      this.model.cantidadConsumicion).then(pacienteEditado => {
        this.pedidoService.cargarPedidoAutomatico(new Date(), this.idPaciente,
          this.selectedMedicamento._id).then((pedidoCargado) => {
            // cierro el modal
            this.cerrarAsignar.nativeElement.click();

            // Muestro un mensajito de Actualizado con Éxito
            Swal.fire({
              title: 'Actualizado!',
              text: 'Se ha asignado el medicamento correctamente.',
              type: 'success',
              showConfirmButton: false,
              timer: 1200
            });

            this.consumicionesPaciente = pacienteEditado.consumiciones;

            let i = 0;
            for (const medicaNoCons of this.medicamentosNoConsume) {
              if (medicaNoCons._id === this.selectedMedicamento._id) {
                this.medicamentosNoConsume.splice(i, 1);
              }
              i++;
            }

            // Reseteo el selectedPaciente y el formulario de editar
            this.selectedMedicamento = null;
            this.model = {};
            f.resetForm();
          });
      });

    // llamar cargar pedido service  revisar bien
    // this.asignarMedicamentoService.cargarPedido(this.selectedPaciente._id, this.selectedMedicamento._id);
  }

  // **************
  // *** QUITAR ***
  // **************
  quitarConsumicion() {
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
          this.pacienteService.quitarConsumicion(this.idPaciente, this.selectedConsumicion._id)
            .then(pacienteEditado => {
              Swal.fire({
                title: 'Quitada!',
                text: 'Consumicion quitada correctamente',
                type: 'success',
                showConfirmButton: false,
                timer: 1200
              });
              let i = 0;
              for (const consumicion of this.consumicionesPaciente) {
                if (consumicion._id === this.selectedConsumicion._id) {
                  this.consumicionesPaciente.splice(i, 1);
                }
                i++;
              }

              this.medicamentosNoConsume.push(this.selectedConsumicion.medicamento);

              this.selectedConsumicion = null;
            });
        }
      });
  }
}

