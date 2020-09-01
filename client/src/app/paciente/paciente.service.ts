import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { UrlService } from '../window.provider.service';
import { Paciente } from './paciente';

import Swal from 'sweetalert2';
import { Medico } from '../medico/medico';
import { ObraSocial } from '../obraSocial/obraSocial';



@Injectable()
export class PacienteService {
    private headers = new Headers({ 'Content-Type': 'application/json' });
    private pacienteURL = this.urlService.getRestApiUrl() + '/paciente';  // URL a la api

    constructor(
        private http: Http,
        private urlService: UrlService
    ) { }

    // ***********
    // *** GET ***
    // ***********
    getPacientes(): Promise<Paciente[]> {
        return this.http.get(this.pacienteURL)
            .toPromise()
            .then(response => response.json().obj as Paciente[])
            .catch(this.handleError);
    }

    getPaciente(idPaciente: string): Promise<Paciente> {
        return this.http.get(this.pacienteURL + '/' + idPaciente)
            .toPromise()
            .then(response => response.json().obj as Paciente)
            .catch(this.handleError);
    }

    // ************
    // *** POST ***
    // ************
    cargarPaciente(
        dniPac: string,
        nombrePac: string,
        apellidoPac: string,
        telefonoPac: string,
        direccionPac: string,
        barrioPac: string,
        fechaNacimientoPac: Date): Promise<Paciente> {

        return this.http.post(this.pacienteURL,
            JSON.stringify({
                dniPaciente: dniPac, nombrePaciente: nombrePac,
                apellidoPaciente: apellidoPac, telefonoPaciente: telefonoPac, direccionPaciente: direccionPac,
                barrioPaciente: barrioPac, fechaNacimientoPaciente: fechaNacimientoPac
            }), { headers: this.headers })
            .toPromise()
            .then(response => response.json().obj as Paciente)
            .catch(this.handleError);
    }

    // *************
    // *** PATCH ***
    // *************
    editarPaciente(
        idPac: string,
        nombrePac: string,
        apellidoPac: string,
        telefonoPac: string,
        direccionPac: string,
        barrioPac: string,
        fechaNacimientoPac: Date): Promise<Paciente> {
        return this.http.patch(this.pacienteURL + '/' + idPac,
            JSON.stringify({
                nombrePaciente: nombrePac,
                apellidoPaciente: apellidoPac, telefonoPaciente: telefonoPac, direccionPaciente: direccionPac,
                barrioPaciente: barrioPac, fechaNacimientoPaciente: fechaNacimientoPac
            }), { headers: this.headers })
            .toPromise()
            .then(response => response.json().obj as Paciente)
            .catch(this.handleError);
    }

    asignarMedicos(idPac: string, idsMedic): Promise<Medico[]> {
        return this.http.patch(this.pacienteURL + '/asignarMedicos/' + idPac,
            JSON.stringify({ idsMedicos: idsMedic }), { headers: this.headers })
            .toPromise()
            .then(response => response.json().obj as Medico[])
            .catch(this.handleError);
    }

    quitarMedico(idPac: string, idMedic): Promise<Medico> {
        return this.http.patch(this.pacienteURL + '/quitarMedico/' + idPac,
            JSON.stringify({ idMedico: idMedic }), { headers: this.headers })
            .toPromise()
            .then(response => response.json().obj as Medico)
            .catch(this.handleError);
    }

    asignarObras(idPac: string, idsObr): Promise<ObraSocial[]> {
        return this.http.patch(this.pacienteURL + '/asignarObrasSociales/' + idPac,
            JSON.stringify({ idsObras: idsObr }), { headers: this.headers })
            .toPromise()
            .then(response => response.json().obj as ObraSocial[])
            .catch(this.handleError);
    }

    quitarObra(idPac: string, idObra): Promise<ObraSocial> {
        return this.http.patch(this.pacienteURL + '/quitarObraSocial/' + idPac,
            JSON.stringify({ idObraSocial: idObra }), { headers: this.headers })
            .toPromise()
            .then(response => response.json().obj as ObraSocial)
            .catch(this.handleError);
    }

    cargarConsumicion(idPaciente: string, idMedicamento: string, frec: number, cantCon: number): Promise<Paciente> {
        return this.http.patch(this.pacienteURL + '/cargarConsumicion/' + idPaciente + '/' + idMedicamento,
            JSON.stringify({ frecuencia: frec, cantidadConsumicion: cantCon }), { headers: this.headers })
            .toPromise()
            .then(response => response.json().obj as Paciente)
            .catch(this.handleError);
    }

    quitarConsumicion(idPac: string, idConsum: string): Promise<Paciente> {
        return this.http.patch(this.pacienteURL + '/quitarConsumicion/' + idPac,
            JSON.stringify({ idConsumicion: idConsum}), { headers: this.headers })
            .toPromise()
            .then(response => response.json().obj as Paciente)
            .catch(this.handleError);
    }

    // **************
    // *** DELETE ***
    // **************
    deletePaciente(idPac: string): Promise<Paciente> {
        return this.http.delete(this.pacienteURL + '/' + idPac)
            .toPromise()
            .then(response => response.json().obj as Paciente)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('Ocurrio un error en Servicio de Pacientes: ', error);
        Swal.fire(
            'Error!',
            error.json().error,
            'error'
        );
        return Promise.reject(error.message || error);
    }
}
