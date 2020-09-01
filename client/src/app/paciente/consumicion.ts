import { Medicamento } from '../medicamento/medicamento';

export class Consumicion {
    _id: string;
    medicamento: Medicamento;
    frecuencia: number;
    cantidadConsumicion: number;
    diasRestantes: number;
    numeroMedicamento: string;
}
