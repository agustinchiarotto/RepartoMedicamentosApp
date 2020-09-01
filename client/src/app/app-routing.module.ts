import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

// COMPONENTES
import { UsuariosComponent } from './usuario/usuarios.component';
import { LoginComponent } from './login/login.component';
import { InicioComponent } from './inicio/inicio.component';
import { PacienteComponent } from './paciente/paciente.component';
import { MedicamentoComponent } from './medicamento/medicamento.component';
import { PedidoComponent } from './pedido/pedido.component';
import { RepartidorComponent } from './repartidor/repartidor.component';
import { MedicoComponent } from './medico/medico.component';
import { ObraSocialComponent } from './obraSocial/obraSocial.component';
import { FarmaciaComponent } from './farmacia/farmacia.component';
import { ClinicaComponent } from './clinica/clinica.component';
import { PacienteDetalleComponent } from './paciente/pacienteDetalle/pacienteDetalle.component';
import { MedicoDetalleComponent } from './medico/medicoDetalle/medicoDetalle.component';
import { ObraSocialDetalleComponent } from './obraSocial/obraSocialDetalle/obraSocialDetalle.component';
import { ClinicaDetalleComponent } from './clinica/clinicaDetalle/clinicaDetalle.component';
import { FarmaciaDetalleComponent } from './farmacia/farmaciaDetalle/farmaciaDetalle.component';
import { PedidoDetalleComponent } from './pedido/pedidoDetalle/pedidoDetalle.component';

const routes: Routes = [
  // REDIRECCIONAMIENTO A INICIO
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },

  // RUTAS A COMPONENTES
  { path: 'inicio', component: InicioComponent, canActivate: [AuthGuard] },
  { path: 'usuarios', component: UsuariosComponent, canActivate: [AuthGuard] },
  { path: 'pacientes', component: PacienteComponent, canActivate: [AuthGuard] },
  { path: 'paciente/:idPaciente', component: PacienteDetalleComponent, canActivate: [AuthGuard] },
  { path: 'medicamentos', component: MedicamentoComponent, canActivate: [AuthGuard] },
  { path: 'pedidos', component: PedidoComponent, canActivate: [AuthGuard] },
  { path: 'pedido/:idPedido', component: PedidoDetalleComponent, canActivate: [AuthGuard] },
  { path: 'repartidores', component: RepartidorComponent, canActivate: [AuthGuard] },
  { path: 'medicos', component: MedicoComponent, canActivate: [AuthGuard] },
  { path: 'medico/:idMedico', component: MedicoDetalleComponent, canActivate: [AuthGuard] },
  { path: 'obras', component: ObraSocialComponent, canActivate: [AuthGuard] },
  { path: 'obraSocial/:idObraSocial', component: ObraSocialDetalleComponent, canActivate: [AuthGuard] },
  { path: 'farmacias', component: FarmaciaComponent, canActivate: [AuthGuard] },
  { path: 'farmacia/:idFarmacia', component: FarmaciaDetalleComponent, canActivate: [AuthGuard] },
  { path: 'clinicas', component: ClinicaComponent, canActivate: [AuthGuard] },
  { path: 'clinica/:idClinica', component: ClinicaDetalleComponent, canActivate: [AuthGuard] },
  { path: 'usuarios', component: UsuariosComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
