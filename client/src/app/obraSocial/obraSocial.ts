import { Paciente } from '../paciente/paciente';

export class ObraSocial {
    _id: string;
    cuit: string;
    nombre: string;
    direccion: string;
    telefono: string;
    email: string;
    pacientes: [Paciente]
}
