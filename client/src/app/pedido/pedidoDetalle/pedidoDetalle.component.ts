import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PedidoService } from '../pedido.service';
import { Pedido } from '../pedido';
import { Medico } from 'src/app/medico/medico';
import { RepartidorService } from 'src/app/repartidor/repartidor.service';
import { FarmaciaService } from 'src/app/farmacia/farmacia.service';
import { Repartidor } from 'src/app/repartidor/repartidor';
import { Farmacia } from 'src/app/farmacia/farmacia';
import { Estado } from '../estado';

@Component({
    selector: 'app-pedido-detalle',
    templateUrl: './pedidoDetalle.component.html'
})
export class PedidoDetalleComponent implements OnInit {
    @ViewChild('cerrarAgregar') cerrarAgregar: ElementRef;

    model: any = {};

    pedido: Pedido;

    repartidores: Repartidor[];
    selectedRepartidor: Repartidor;

    farmacias: Farmacia[];
    selectedFarmacia: Farmacia;

    medicosPedido: Medico[];
    estados: Estado[];

    editar = false;
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private pedidoService: PedidoService,
        private repartidorService: RepartidorService,
        private farmaciaService: FarmaciaService

    ) { }

    ngOnInit() {
        this.getPedido();
        this.getRepartidores();
        this.getFarmacias();
        this.getEstados();
    }

    // ***********
    // *** GET ***
    // ***********
    getPedido(): void {
        this.route.params.forEach((params: Params) => {
            const id = params.idPedido;
            this.pedidoService.getPedido(id)
                .then(pedido => {
                    this.pedido = pedido;
                });
        });
    }
    getRepartidores(): void {

        this.repartidorService.getRepartidores()
            .then(repartidores => {
                this.repartidores = repartidores;
            });

    }

    getFarmacias(): void {

        this.farmaciaService.getFarmacias()
            .then(farmacias => {
                this.farmacias = farmacias;
            });

    }

    getEstados() {
        this.pedidoService.getEstados()
        .then(estados => {
            this.estados = estados;
        });
    }

    // ******************
    // *** ACTUALIZAR ***
    // ******************
    actualizarPedido(): void {
        let idRepartidor = null;
        let idFarmacia = null;
        if (this.selectedRepartidor) {
            idRepartidor = this.selectedRepartidor._id
        }

        if (this.selectedFarmacia) {
            idFarmacia = this.selectedFarmacia._id
            
        }

        this.pedidoService
            .editarPedido(this.pedido._id, idRepartidor, idFarmacia)
            .then(pedidoActualizado => {
                // Mensaje de Éxito
                Swal.fire({
                    title: 'Actualizado!',
                    text: 'Se ha actualizado el pedido correctamente.',
                    type: 'success',
                    showConfirmButton: false,
                    timer: 1200
                });

                this.pedido = pedidoActualizado;

                this.editar = false;
            });
    }

    // ****************
    // *** ELIMINAR ***
    // ****************
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
                    this.pedidoService.deletePedido(this.pedido._id)
                        .then(pedidoEliminado => {
                            Swal.fire(
                                'Eliminado!',
                                'Pedido eliminado correctamente',
                                'success'
                            );
                            this.router.navigate(['/pedidos']);
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
    estadoSiguiente()
    {
        this.pedidoService.estadoSiguiente(this.pedido._id)
        .then(pedidoActualizado => {
            // Mensaje de Éxito
            Swal.fire({
                title: 'Actualizado!',
                text: 'Se ha actualizado el pedido correctamente.',
                type: 'success',
                showConfirmButton: false,
                timer: 1200
            });

            this.pedido = pedidoActualizado;
        });
    }

    estadoAnterior()
    {
        this.pedidoService.estadoAnterior(this.pedido._id)
        .then(pedidoActualizado => {
            // Mensaje de Éxito
            Swal.fire({
                title: 'Actualizado!',
                text: 'Se ha actualizado el pedido correctamente.',
                type: 'success',
                showConfirmButton: false,
                timer: 1200
            });

            this.pedido = pedidoActualizado;
        });
    }

    estadoPendiente()
    {
        this.pedidoService.estadoPendiente(this.pedido._id)
        .then(pedidoActualizado => {
            // Mensaje de Éxito
            Swal.fire({
                title: 'Actualizado!',
                text: 'Se ha actualizado el pedido correctamente.',
                type: 'success',
                showConfirmButton: false,
                timer: 1200
            });

            this.pedido = pedidoActualizado;
        });
    }

    
    estadoNoPendiente()
    {
        this.pedidoService.estadoNoPendiente(this.pedido._id)
        .then(pedidoActualizado => {
            // Mensaje de Éxito
            Swal.fire({
                title: 'Actualizado!',
                text: 'Se ha actualizado el pedido correctamente.',
                type: 'success',
                showConfirmButton: false,
                timer: 1200
            });

            this.pedido = pedidoActualizado;
        });
    }


}
