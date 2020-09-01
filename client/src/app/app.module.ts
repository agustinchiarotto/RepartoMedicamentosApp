import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

// PrimeNG
import {AccordionModule, CalendarModule, MenuItem} from 'primeng/primeng';
import { SharedModule, PanelModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/button';
import { DataTableModule } from 'primeng/primeng';
import { TableModule } from 'primeng/components/table/table';
import {DropdownModule} from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {TabViewModule} from 'primeng/tabview';

// COMPONENTES
import { AppComponent } from './app.component';
import { FooterComponent } from './layout/footer/footer.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { HeaderComponent } from './layout/header/header.component';
import { UsuariosComponent } from './usuario/usuarios.component';
import { InicioComponent } from './inicio/inicio.component';
import { LoginComponent } from './login/login.component';
import { PacienteComponent } from './paciente/paciente.component';
import { MedicamentoComponent } from './medicamento/medicamento.component';
import { PedidoComponent } from './pedido/pedido.component';
import { RepartidorComponent } from './repartidor/repartidor.component';
import { MedicoComponent } from './medico/medico.component';
import { ObraSocialComponent } from './obraSocial/obraSocial.component';
import { AsignarConsumicionComponent } from './paciente/pacienteDetalle/asignar_consumicion/asignar_consumicion.component';
import { FarmaciaComponent } from './farmacia/farmacia.component';
import { ClinicaComponent } from './clinica/clinica.component';
import { AsignarObraComponent } from './paciente/pacienteDetalle/asignar_obra/asignar_obra.component';
import { AsignarMedicoComponent } from './paciente/pacienteDetalle/asignar_medico/asignar_medico.component';
import { AsignarMedicamentoComponent } from './farmacia/farmaciaDetalle/asignar_medicamento/asignar_medicamento.component';
import { PacienteDetalleComponent } from './paciente/pacienteDetalle/pacienteDetalle.component';
import { MedicoDetalleComponent } from './medico/medicoDetalle/medicoDetalle.component';
import { ObraSocialDetalleComponent } from './obraSocial/obraSocialDetalle/obraSocialDetalle.component';
import { ClinicaDetalleComponent } from './clinica/clinicaDetalle/clinicaDetalle.component';
import { AsignarClinicaComponent } from './medico/medicoDetalle/asignar_clinica/asignar_clinica.component';
import { FarmaciaDetalleComponent } from './farmacia/farmaciaDetalle/farmaciaDetalle.component';
import { PedidoDetalleComponent } from './pedido/pedidoDetalle/pedidoDetalle.component';

// SERVICIOS
import { AuthenticationService } from './auth/auth.service';
import { UrlService } from './window.provider.service';
import { WINDOW_PROVIDERS } from './window.provider';
import { UsuarioService } from './usuario/user.service';
import { AuthGuard } from './auth/auth.guard';
import { MedicoService } from './medico/medico.service';
import { RepartidorService } from './repartidor/repartidor.service';
import { ObraService } from './obraSocial/obraSocial.service';
import { MedicamentoService} from './medicamento/medicamento.service';
import {PacienteService} from './paciente/paciente.service';
import {PedidoService} from './pedido/pedido.service';
import { FarmaciaService } from './farmacia/farmacia.service';
import { ClinicaService } from './clinica/clinica.service';
import { PermissionService } from './usuario/permiso.service';


@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    SidebarComponent,
    HeaderComponent,
    LoginComponent,
    InicioComponent,
    UsuariosComponent,
    PacienteComponent,
    MedicamentoComponent,
    PedidoComponent,
    RepartidorComponent,
    MedicoComponent,
    ObraSocialComponent,
    FarmaciaComponent,
    ClinicaComponent,
    AsignarConsumicionComponent,
    AsignarMedicoComponent,
    AsignarObraComponent,
    AsignarMedicamentoComponent,
    PacienteDetalleComponent,
    MedicoDetalleComponent,
    ObraSocialDetalleComponent,
    ClinicaDetalleComponent,
    AsignarClinicaComponent,
    FarmaciaDetalleComponent,
    PedidoDetalleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    CommonModule,
    HttpClientModule,
    AccordionModule,
    ButtonModule,
    PanelModule,
    SharedModule,
    DataTableModule,
    TableModule,
    CalendarModule,
    FormsModule,
    DialogModule,
    DropdownModule,
    MessagesModule,
    MessageModule,
    TabViewModule
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    AuthenticationService,
    UrlService,
    WINDOW_PROVIDERS,
    UsuarioService,
    AuthGuard,
    MedicoService,
    ObraService,
    RepartidorService,
    MedicamentoService,
    PacienteService,
    PedidoService,
    FarmaciaService,
    ClinicaService,
    PermissionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
