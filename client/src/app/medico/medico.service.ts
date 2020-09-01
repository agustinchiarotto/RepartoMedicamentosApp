import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { UrlService } from '../window.provider.service';
import { Medico } from './medico';
import Swal from 'sweetalert2';
import { Clinica } from '../clinica/clinica';



@Injectable()
export class MedicoService {
    private headers = new Headers({ 'Content-Type': 'application/json' });
    private medicoURL = this.urlService.getRestApiUrl() + '/medico';  // URL a la api

    constructor(
        private http: Http,
        private urlService: UrlService
    ) { }

    getMedicos(): Promise<Medico[]> {
        return this.http.get(this.medicoURL)
            .toPromise()
            .then(response => response.json().obj as Medico[])
            .catch(this.handleError);
    }

    getMedico(idMedico: string): Promise<Medico> {
        return this.http.get(this.medicoURL + '/' + idMedico)
            .toPromise()
            .then(response => response.json().obj as Medico)
            .catch(this.handleError);
    }

    getMedicosNoAsignados(idPaciente: string): Promise<Medico[]> {
        return this.http.get(this.medicoURL + '/medicosNoAsignados/' + idPaciente)
            .toPromise()
            .then(response => response.json().obj as Medico[])
            .catch(this.handleError);
    }

    cargarMedico(
        dniMed: string,
        nombreMed: string,
        apellidoMed: string,
        telefonoMed: string,
        matriculaMed: string,
        especialidadMed: string): Promise<Medico> {
        return this.http.post(this.medicoURL,
            JSON.stringify({
                dniMedico: dniMed, nombreMedico: nombreMed,
                apellidoMedico: apellidoMed, telefonoMedico: telefonoMed,
                matriculaMedico: matriculaMed, especialidadMedico: especialidadMed
            }), { headers: this.headers })
            .toPromise()
            .then(response => response.json().obj as Medico)
            .catch(this.handleError);
    }

    editarMedico(
        idMed: string,
        nombreMed: string,
        apellidoMed: string,
        telefonoMed: string,
        matriculaMed: string,
        especialidadMed: string): Promise<Medico> {
        return this.http.patch(this.medicoURL + '/' + idMed,
            JSON.stringify({
                nombreMedico: nombreMed,
                apellidoMedico: apellidoMed, telefonoMedico: telefonoMed,
                matriculaMedico: matriculaMed, especialidadMedico: especialidadMed
            }), { headers: this.headers })
            .toPromise()
            .then(response => response.json().obj as Medico)
            .catch(this.handleError);
    }

    asignarClinicas(idMedico: string, idsClinic): Promise<Clinica[]> {
        return this.http.patch(this.medicoURL + '/asignarMedicos/' + idMedico,
            JSON.stringify({ idsClinicas: idsClinic }), { headers: this.headers })
            .toPromise()
            .then(response => response.json().obj as Clinica[])
            .catch(this.handleError);
    }

    quitarClinica(idMedico: string, idClinic): Promise<Clinica> {
        return this.http.patch(this.medicoURL + '/quitarMedico/' + idMedico,
            JSON.stringify({ idClinica: idClinic }), { headers: this.headers })
            .toPromise()
            .then(response => response.json().obj as Clinica)
            .catch(this.handleError);
    }

    deleteMedico(idMed: string): Promise<Medico> {
        return this.http.delete(this.medicoURL + '/' + idMed)
            .toPromise()
            .then(response => response.json().obj as Medico)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('Ocurrio un error en Servicio de Medicos: ', error);
        Swal.fire(
            'Error!',
            error.json().error,
            'error'
        );
        return Promise.reject(error.message || error);
    }
}
