import { Medicamento } from '../medicamento/medicamento';

export class Farmacia {
    _id: string;
    cuit: string;
    nombre: string;
    direccion: string;
    telefono: string;
    email: string;
    medicamentos: [Medicamento];
}
