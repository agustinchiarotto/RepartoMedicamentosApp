import { Paciente } from '../paciente/paciente';
import { Medicamento } from '../medicamento/medicamento';
import { Repartidor } from '../repartidor/repartidor';
import { Farmacia } from '../farmacia/farmacia';
import { EstadoPedido } from './estadoPedido';

export class Pedido {
    _id: string;
    numero: number;
    estadosPedido: [EstadoPedido];
    fecha: Date;
    paciente: Paciente;
    repartidor: Repartidor;
    farmacia: Farmacia;
    medicamento: Medicamento;
}
