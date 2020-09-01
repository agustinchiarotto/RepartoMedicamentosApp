import { Medico } from '../medico/medico';

export class Clinica {
    _id: string;
    cuit: string;
    nombre: string;
    direccion: string;
    telefono: string;
    email: string;
    medicos: [Medico];
}
