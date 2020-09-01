import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { UrlService } from '../window.provider.service';
import { Medicamento } from './medicamento';
import Swal from 'sweetalert2';
import { Paciente } from '../paciente/paciente';

@Injectable()
export class MedicamentoService {
    private headers = new Headers({ 'Content-Type': 'application/json' });
    private medicamentoURL = this.urlService.getRestApiUrl() + '/medicamento';  // URL a la api

    constructor(
        private http: Http,
        private urlService: UrlService
    ) { }

    getMedicamentos(): Promise<Medicamento[]> {
        return this.http.get(this.medicamentoURL)
            .toPromise()
            .then(response => response.json().obj as Medicamento[])
            .catch(this.handleError);
    }

    getMedicamentosNoConsumePaciente(idPaciente: string): Promise<Medicamento[]> {

        return this.http.get(this.medicamentoURL + '/noConsume' + '/' + idPaciente)
            .toPromise()
            .then(response => response.json().obj as Medicamento[])
            .catch(this.handleError);
    }

    getMedicamentosNoFarmacia(idFarmacia: string): Promise<Medicamento[]> {

        return this.http.get(this.medicamentoURL + '/noConsumeFarmacia' + '/' + idFarmacia)
            .toPromise()
            .then(response => response.json().obj as Medicamento[])
            .catch(this.handleError);
    }

    cargarMedicamento(
        nombreMedMedicam: string,
        dosisMedMedicam: string,
        cadenaDeFrioMedMedicam: string,
        laboratorioMedicam: string,
        cantidadComprimidosMedicam: number): Promise<Medicamento> {

        return this.http.post(this.medicamentoURL,
            JSON.stringify({
                nombreMedicamento: nombreMedMedicam,
                dosisMedicamento: dosisMedMedicam, cadenaFrioMedicamento: cadenaDeFrioMedMedicam,
                laboratorioMedicamento: laboratorioMedicam,
                cantidadComprimidosMedicamento: cantidadComprimidosMedicam
            }), { headers: this.headers })
            .toPromise()
            .then(response => response.json().obj as Medicamento)
            .catch(this.handleError);
    }

    editarMedicamento(
        idMedMedicam: string,
        nombreMedMedicam: string,
        dosisMedMedicam: string,
        cadenaDeFrioMedMedicam: string,
        laboratorioMedicam: string,
        cantidadComprimidosMedicam: number): Promise<Medicamento> {
        return this.http.patch(this.medicamentoURL + '/' + idMedMedicam,
            JSON.stringify({
                idMedicamento: idMedMedicam, nombreMedicamento: nombreMedMedicam,
                dosisMedicamento: dosisMedMedicam, cadenaFrioMedicamento: cadenaDeFrioMedMedicam,
                laboratorioMedicamento: laboratorioMedicam,
                cantidadComprimidosMedicamento: cantidadComprimidosMedicam
            }), { headers: this.headers })
            .toPromise()
            .then(response => response.json().obj as Medicamento)
            .catch(this.handleError);
    }

    deleteMedicamento(idMedMedicam: string): Promise<Medicamento> {
        return this.http.delete(this.medicamentoURL + '/' + idMedMedicam)
            .toPromise()
            .then(response => response.json().obj as Medicamento)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('Ocurrio un error en Servicio de Medicamentos: ', error);
        Swal.fire(
            'Error!',
            error.json().error,
            'error'
        );
        return Promise.reject(error.message || error);
    }
}
