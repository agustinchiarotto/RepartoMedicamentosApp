import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { UrlService } from '../window.provider.service';
import { ObraSocial } from './obraSocial';
import Swal from 'sweetalert2';





@Injectable()
export class ObraService {
    private headers = new Headers({ 'Content-Type': 'application/json' });
    private obraURL = this.urlService.getRestApiUrl() + '/obra';  // URL a la api

    constructor(
        private http: Http,
        private urlService: UrlService

    ) { }

    getObras(): Promise<ObraSocial[]> {
        return this.http.get(this.obraURL)
            .toPromise()
            .then(response => response.json().obj as ObraSocial[])
            .catch(this.handleError);
    }

    getObraSocial(idObraSocial: string): Promise<ObraSocial> {
        return this.http.get(this.obraURL + '/' + idObraSocial)
            .toPromise()
            .then(response => response.json().obj as ObraSocial)
            .catch(this.handleError);
    }

    getObrasNoAsignadas(idPaciente: string): Promise<ObraSocial[]> {
        return this.http.get(this.obraURL + '/obrasNoAsignadas/' + idPaciente)
            .toPromise()
            .then(response => response.json().obj as ObraSocial[])
            .catch(this.handleError);
    }

    cargarObra(
        cuitOb: string,
        nombreOb: string,
        direccionOb: string,
        telefonoOb: string,
        emailOb: string): Promise<ObraSocial> {

        return this.http.post(this.obraURL,
            JSON.stringify({
                cuitObraSocial: cuitOb, nombreObra: nombreOb,
                direccionObra: direccionOb, telefonoObra: telefonoOb,
                emailObra: emailOb
            }), { headers: this.headers })
            .toPromise()
            .then(response => response.json().obj as ObraSocial)
            .catch(this.handleError);
    }

    editarObraSocial(
        idObraSocial: string,
        cui: string,
        nombreOb: string,
        direccionOb: string,
        emailOb: string,
        telefonoOb: string): Promise<ObraSocial> {

        return this.http.patch(this.obraURL + '/' + idObraSocial,
            JSON.stringify({
                cuit: cui,
                nombreObra: nombreOb,
                direccionObra: direccionOb, telefonoObra: telefonoOb,
                emailObra: emailOb
            }), { headers: this.headers })
            .toPromise()
            .then(response => response.json().obj as ObraSocial)
            .catch(this.handleError);
    }

    deleteObraSocial(idOb: string): Promise<ObraSocial> {
        return this.http.delete(this.obraURL + '/' + idOb)
            .toPromise()
            .then(response => response.json().obj as ObraSocial)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('Ocurrio un error en Servicio de la Obra Social: ', error);
        Swal.fire(
            'Error!',
            error.json().error,
            'error'
        );
        return Promise.reject(error.message || error);
    }
}
