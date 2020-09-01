import { Clinica } from '../clinica/clinica';
import { Paciente } from '../paciente/paciente';

export class Medico {
    _id: string;
    dni: string;
    nombre: string;
    apellido: string;
    telefono: string;
    matricula: string;
    especialidad: string;
    clinicas: [Clinica];
    pacientes: [Paciente];
}
