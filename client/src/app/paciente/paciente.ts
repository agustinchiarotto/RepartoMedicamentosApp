import { Medico } from '../medico/medico';
import { ObraSocial } from '../obraSocial/obraSocial';
import { Medicamento } from '../medicamento/medicamento';
import { Consumicion } from './consumicion';

export class Paciente {
    _id: string;
    dni: string;
    nombre: string;
    apellido: string;
    telefono: string;
    direccion: string;
    fechaNacimiento: Date;
    barrio: string;
    medicos: [Medico];
    consumiciones: [Consumicion];
    obras: [ObraSocial];
    medicamentos: [Medicamento];
}
