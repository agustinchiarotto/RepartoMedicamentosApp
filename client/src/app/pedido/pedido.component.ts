import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { routerTransition } from '../router.animations';
import { Pedido } from './pedido';
import { PedidoService } from './pedido.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Paciente } from '../paciente/paciente';
import { PacienteService } from '../paciente/paciente.service';
import { Medicamento } from '../medicamento/medicamento';

import { MedicamentoService } from '../medicamento/medicamento.service';
import { RepartidorService } from '../repartidor/repartidor.service';
import { Repartidor } from '../repartidor/repartidor';
import { FarmaciaService } from '../farmacia/farmacia.service';
import { Farmacia } from '../farmacia/farmacia';

interface Estados {
  name: string;
}

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  animations: [routerTransition()]
})
export class PedidoComponent implements OnInit {
  @ViewChild('cerrarAgregar') cerrarAgregar: ElementRef;

  model: any = {};
  pedidos: Pedido[] = [];
  cols: any[];
  selectedPedido: Pedido;
  fecha: string;

  estados: Estados[];
  selectedEstado: Estados;

  // Pacientes
  pacientes: Paciente[] = [];
  selectedPaciente: Paciente;

  // Medicamentos
  medicamentos: Medicamento[] = [];
  selectedMedicamento: Medicamento;

  // Farmacias
  farmaciasMedicamento: Farmacia[] = [];
  selectedFarmacia: Farmacia;

  // Repartidores
  repartidores: Repartidor[];
  selectedRepartidor: Repartidor;

  constructor(
    private pedidoService: PedidoService,
    private pacienteService: PacienteService,
    private medicamentoService: MedicamentoService,
    private farmaciaService: FarmaciaService,
    private repartidorService: RepartidorService
  ) {}


  ngOnInit() {
    this.getPacientes();
    this.getRepartidores();

    this.cols = [
      { field: 'numero', header: 'Numero Pedido' },
      { field: 'estadosPedido', header: 'Estado' },
      { field: 'fecha', header: 'Fecha Pedido' },
      { field: 'paciente', subfield: 'apellido', header: 'Apellido Paciente' },
      { field: 'paciente', subfield: 'direccion', header: 'Dirección' },
      { field: 'repartidor', header: 'Apellido Repartidor' },
      { field: 'medicamento', subfield: 'nombre', header: 'Medicamento' },
      { field: 'medicamento', subfield: 'cadenaFrio', header: 'Cadena Frio' }
    ];
  }

  // ***********
  // *** GET ***
  // ***********
  getPedidos(estado: string) {
    this.pedidoService.getPedidos(estado)
      .then(pedidos => {
        this.pedidos = pedidos;
      });
  }

  getPacientes() {
    this.pacienteService.getPacientes()
      .then(pacientes => {
        this.pacientes = pacientes;
      });
  }

  getMedicamentosPaciente() {
    this.medicamentoService.getMedicamentosNoConsumePaciente(this.model.paciente._id)
      .then(medicamentos => {
        this.medicamentos = medicamentos;
      });
  }

  getFarmaciasMedicamento() {
    this.farmaciaService.getFarmaciasMedicamento(this.model.medicamento._id)
      .then(farmaciasMedicamento => {
        this.farmaciasMedicamento = farmaciasMedicamento;
      });
  }

  getRepartidores() {
    this.repartidorService.getRepartidores()
      .then(repartidores => {
        this.repartidores = repartidores;
      });
  }

  // CARGAR PEDIDO
  cargarPedido(f: NgForm) {
    this.pedidoService.cargarPedido(this.model.fechaPedido, this.model.paciente._id,
      this.model.medicamento._id, this.model.farmacia._id, this.model.repartidor._id )
      .then(pedidoAgregado => {
        // cierro el modal
        this.cerrarAgregar.nativeElement.click();

        // Muestro un mensajito de Agregado con Éxito
        Swal.fire({
          title: 'Agregado!',
          text: 'Se ha creado el pedido correctamente.',
          type: 'success',
          showConfirmButton: false,
          timer: 1200
        });

        // Agrego el Pedido al Arreglo de Pedidos (actualiza la tabla)
        this.pedidos.push(pedidoAgregado);

        // Reseteo el formulario/modal para que no haya nada en los input cuando se vuelva a abrir
        f.resetForm();
      });
  }

  // EDITAR Pedido
  editarPedido(f: NgForm) {

  }

  // ELIMINAR PEDIDO
  eliminarPedido() {
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
          this.pedidoService.deletePedido(this.selectedPedido._id)
            .then(pedidoEliminado => {
              Swal.fire(
                'Eliminado!',
                'Pedido eliminado correctamente',
                'success'
              );
              // Elimino el medico del arreglo de medicos (actualiza la tabla)
              let i;

              // Con el forEach busco la posicion (index) del medico eliminado
              this.pedidos.forEach((pedido, index) => {
                if (pedido._id === pedidoEliminado._id) {
                  i = index;
                }
              });

              // 'splice' corta el arreglo justo en el indice 'i'
              this.pedidos.splice(i, 1);

              // Reseteo el medico seleccionado a null
              this.selectedPedido = null;
            });
        } else {
          // Reseteo el medico seleccionado a null
          this.selectedPedido = null;
        }
      });

  }
}




