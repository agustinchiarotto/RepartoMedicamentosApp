import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { UrlService } from '../window.provider.service';
import Swal from 'sweetalert2';
import { Farmacia } from './farmacia';
import { Medicamento } from '../medicamento/medicamento';

@Injectable()
export class FarmaciaService {
    private headers = new Headers({ 'Content-Type': 'application/json' });
    private farmaciaURL = this.urlService.getRestApiUrl() + '/farmacia';  // URL a la api

    constructor(
        private http: Http,
        private urlService: UrlService
    ) { }

    getFarmacias(): Promise<Farmacia[]> {
        return this.http.get(this.farmaciaURL)
            .toPromise()
            .then(response => response.json().obj as Farmacia[])
            .catch(this.handleError);
    }

    getFarmacia(idFarmacia: string): Promise<Farmacia> {
        return this.http.get(this.farmaciaURL + '/' + idFarmacia)
            .toPromise()
            .then(response => response.json().obj as Farmacia)
            .catch(this.handleError);
    }

    getFarmaciasMedicamento(idMedicamento: string): Promise<Farmacia[]> {
        return this.http.get(this.farmaciaURL + '/farmaciasMedicamento/' + idMedicamento)
            .toPromise()
            .then(response => response.json().obj as Farmacia[])
            .catch(this.handleError);
    }

    getFarmaciasNoAsignadas(idMedicamento: string): Promise<Farmacia[]> {
        return this.http.get(this.farmaciaURL + '/clinicasNoAsignadas/' + idMedicamento)
            .toPromise()
            .then(response => response.json().obj as Farmacia[])
            .catch(this.handleError);
    }

    cargarFarmacia(
        cuitFar: string,
        nombreFar: string,
        direccionFar: string,
        telefonoFar: string,
        emailFar: string): Promise<Farmacia> {
        return this.http.post(this.farmaciaURL,
            JSON.stringify({
                cuitFarmacia: cuitFar, nombreFarmacia: nombreFar,
                telefonoFarmacia: telefonoFar, direccionFarmacia: direccionFar,
                emailFarmacia: emailFar
            }), { headers: this.headers })
            .toPromise()
            .then(response => response.json().obj as Farmacia)
            .catch(this.handleError);
    }

    editarFarmacia(
        idFarmacia: string,
        cuitFar: string,
        nombreFar: string,
        direccionFar: string,
        telefonoFar: string,
        emailFar: string): Promise<Farmacia> {
        return this.http.patch(this.farmaciaURL + '/' + idFarmacia,
            JSON.stringify({
                cuitFarmacia: cuitFar, nombreFarmacia: nombreFar,
                telefonoFarmacia: telefonoFar, direccionFarmacia: direccionFar,
                emailFarmacia: emailFar
            }), { headers: this.headers })
            .toPromise()
            .then(response => response.json().obj as Farmacia)
            .catch(this.handleError);
    }

    asignarMedicamentos(idFarmacia: string, idsMedic): Promise<Medicamento[]> {
        return this.http.patch(this.farmaciaURL + '/asignarMedicamentos/' + idFarmacia,
            JSON.stringify({ idsMedicamentos: idsMedic }), { headers: this.headers })
            .toPromise()
            .then(response => response.json().obj as Medicamento[])
            .catch(this.handleError);
    }

    quitarMedicamento(idFarmacia: string, idMedic): Promise<Medicamento> {
        return this.http.patch(this.farmaciaURL + '/quitarMedicamento/' + idFarmacia,
            JSON.stringify({ idMedicamento: idMedic }), { headers: this.headers })
            .toPromise()
            .then(response => response.json().obj as Medicamento)
            .catch(this.handleError);
    }

    deleteFarmacia(idFarmacia: string): Promise<Farmacia> {
        return this.http.delete(this.farmaciaURL + '/' + idFarmacia)
            .toPromise()
            .then(response => response.json().obj as Farmacia)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('Ocurrio un error en Servicio de Farmacias: ', error);
        Swal.fire(
            'Error!',
            error.json().error,
            'error'
        );
        return Promise.reject(error.message || error);
    }
}
