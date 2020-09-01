import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { UrlService } from '../window.provider.service';
import { Pedido } from './pedido';
import Swal from 'sweetalert2';
import { Paciente } from '../paciente/paciente';
import { Estado } from './estado';



@Injectable()
export class PedidoService {
    private headers = new Headers({ 'Content-Type': 'application/json' });
    private pedidoURL = this.urlService.getRestApiUrl() + '/pedido';  // URL a la api

    constructor(
        private http: Http,
        private urlService: UrlService
    ) { }
    // me conecto a la base de datos
    getPedidos(estado: string): Promise<Pedido[]> {
        return this.http.get(this.pedidoURL + '/' + estado)
            .toPromise()
            .then(response => response.json().obj as Pedido[]) // coneccion con exito
            .catch(this.handleError); // obtento el error en caso de que se produzca uno
    }

    getPedido(idPedido: string): Promise<Pedido> {
        return this.http.get(this.pedidoURL + '/getPedido/getPedido/' + idPedido)
            .toPromise()
            .then(response => response.json().obj as Pedido)
            .catch(this.handleError);
    }


    getPacientes(): Promise<Paciente[]> {
        return this.http.get(this.pedidoURL)
            .toPromise()
            .then(response => response.json().obj as Pedido[]) // coneccion con exito
            .catch(this.handleError); // obtento el error en caso de que se produzca uno
    }

    getEstados(): Promise<Estado[]> {
        return this.http.get(this.pedidoURL + '/getEstados/getEstados/getEstados/000')
            .toPromise()
            .then(response => response.json().obj as Estado[]) // coneccion con exito
            .catch(this.handleError); // obtento el error en caso de que se produzca uno
    }

    cargarPedido(
        fechaPed: Date,
        idPac: string,
        idMedica: string,
        idFarma: string,
        idRepar: string,
    ): Promise<Pedido> {
        return this.http.post(this.pedidoURL,
            JSON.stringify({
                fechaPedido: fechaPed, idPaciente: idPac, idMedicamento: idMedica,
                idFarmacia: idFarma, idRepartidor: idRepar
            }), { headers: this.headers })
            .toPromise()
            .then(response => response.json().obj as Pedido)
            .catch(this.handleError);
    }

    cargarPedidoAutomatico(
        fechaPed: Date,
        idPac: string,
        idMedica: string
    ): Promise<Pedido> {
        return this.http.post(this.pedidoURL + '/automatico/000',
            JSON.stringify({
                fechaPedido: fechaPed, idPaciente: idPac, idMedicamento: idMedica}),
                { headers: this.headers })
            .toPromise()
            .then(response => response.json().obj as Pedido)
            .catch(this.handleError);
    }

    editarPedido(
        idPed: string,
        idRep: string,
        idFarma: string
    ): Promise<Pedido> {
        return this.http.patch(this.pedidoURL + '/' + idPed,
            JSON.stringify({
                repartidor: idRep,
                farmacia: idFarma,
            }), { headers: this.headers })
            .toPromise()
            .then(response => response.json().obj as Pedido)
            .catch(this.handleError);
    }

    estadoSiguiente(
        idPed: string
    ): Promise<Pedido> {
        return this.http.patch(this.pedidoURL + '/siguienteEstado/siguienteEstado/siguienteEstado/siguienteEstado/' + idPed,// ver ruta que no se pise..
            JSON.stringify({
            }), { headers: this.headers })
            .toPromise()
            .then(response => response.json().obj as Pedido)
            .catch(this.handleError);
    }


    
    estadoAnterior(
        idPed: string
    ): Promise<Pedido> {
        return this.http.patch(this.pedidoURL + '/anteriorEstado/' + idPed,// ver ruta que no se pise..
            JSON.stringify({
            }), { headers: this.headers })
            .toPromise()
            .then(response => response.json().obj as Pedido)
            .catch(this.handleError);
    }


    estadoPendiente(
        idPed: string
    ): Promise<Pedido> {
        return this.http.patch(this.pedidoURL + '/estadoPendiente/' + idPed,// ver ruta que no se pise..
            JSON.stringify({
            }), { headers: this.headers })
            .toPromise()
            .then(response => response.json().obj as Pedido)
            .catch(this.handleError);
    }

    estadoNoPendiente(
        idPed: string
    ): Promise<Pedido> {
        return this.http.patch(this.pedidoURL + '/estadoNoPendiente/' + idPed,// ver ruta que no se pise..
            JSON.stringify({
            }), { headers: this.headers })
            .toPromise()
            .then(response => response.json().obj as Pedido)
            .catch(this.handleError);
    }

    deletePedido(idPed: string): Promise<Pedido> {
        return this.http.delete(this.pedidoURL + '/' + idPed)
            .toPromise()
            .then(response => response.json().obj as Pedido)
            .catch(this.handleError);
    }

    contarPedidos() {
        return this.http.get(this.pedidoURL + '/conteo/000')
            .toPromise()
            .then(response => response.json().obj as any)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('Ocurrio un error en Servicio de Pedidos: ', error);
        Swal.fire(
            'Error!',
            error.json().error,
            'error'
        );
        return Promise.reject(error.message || error);
    }

    

}
