import { Component, OnInit } from '@angular/core';
import { PedidoService } from '../pedido/pedido.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
})
export class InicioComponent implements OnInit {

  conteo: any;

  constructor(
    private pedidoService: PedidoService
  ) { }

  ngOnInit() {
    this.getContarPedidos();
  }

  getContarPedidos() {
    this.pedidoService.contarPedidos()
    .then(conteo => {
      this.conteo = conteo;
    });
  }
}
