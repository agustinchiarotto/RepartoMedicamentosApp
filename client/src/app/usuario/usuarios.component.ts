import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { Usuario } from './usuario';
import { UsuarioService } from './user.service';
import {Permission} from './permiso';
import {PermissionService} from './permiso.service';
import {SecurityUtils} from '../SecurityUtils';
import { stringify } from 'querystring';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';

declare var $: any;

@Component({
    selector: 'app-usuarios',
    templateUrl: './usuarios.component.html'
})
export class UsuariosComponent implements OnInit {
  @ViewChild('cerrarAgregar') cerrarAgregar: ElementRef;

    model: any = {};
    usuarios: Usuario[];
    selectedUsuario: Usuario;
    permisos: Permission[];

    selectedUsuarioLocal: Usuario;
    colsUsuarios: any;
    permisionEdit = false;
    initializedTablePermissions = false;
    usuarioEdit = false;

    nombre: string;
    apellido: string;
    username: string;
    password: string;

    constructor(
        private router: Router,
        private usuarioService: UsuarioService,
        private permisoService: PermissionService
    ) { }

    ngOnInit(): void {
        this.getUsuarios();
        this.getPermissions();

        this.colsUsuarios = [
            { field: 'firstName', header: 'Nombre' },
            { field: 'lastName', header: 'Apellido' },
            { field: 'username', header: 'Usuario' }
        ];
    }

    getUsuarios(): void {
        this.usuarioService
            .getUsuarios()
            .then(users => {
                this.usuarios = users;
            });
    }

    getPermissions(): void {
        this.permisoService
            .getPermissions()
            .then(permisos => {
                this.permisos = permisos;
            });
    }

    onRowSelect(event) {
        this.usuarioEdit = true;
        if (!this.initializedTablePermissions) {
            this.initializedTablePermissions = true;
        }
    }

    hasPermision(id) {
        if (this.selectedUsuario.permisos) {
            for (const permiso of this.selectedUsuario.permisos) {
                if (permiso._id === id) {
                    return true;
                }
            }
            return false;
        }
        return false;
    }

    onAddUsuario(nuevoUsuario: Usuario) {
        this.usuarios = [...this.usuarios, nuevoUsuario];
    }

    onSelect(user: Usuario): void {
        // Hacemos unos clones
        this.selectedUsuario = Object.assign({}, user);
    }

    onClean(): void {
        // Hacemos unos clones
        this.selectedUsuario = null;
    }

    onEdit(est: boolean): void {
        this.usuarioEdit = est;
        this.selectedUsuarioLocal = this.selectedUsuario;
    }

    onSave(user: Usuario): void {
        this.usuarios.forEach(function(elem, index, array) {
            if (elem._id === user._id) {
                this.usuarios[index] = user;
            }
        });
    }

    editPermissions() {
        this.permisionEdit = !this.permisionEdit;
        if (this.permisionEdit) {
            this.selectedUsuarioLocal = this.selectedUsuario;
        }
    }

    savePermissions() {
        this.usuarioService.updateUsuario(this.selectedUsuarioLocal._id, this.selectedUsuarioLocal.username,
            this.selectedUsuarioLocal.firstName, this.selectedUsuarioLocal.lastName,
            this.selectedUsuarioLocal.password, this.selectedUsuarioLocal.permisos)
            .then(usr => {
                this.getUsuarios();
                this.editPermissions();
            });

    }

    setPermissions(permiso) {
        const index = this.selectedUsuarioLocal.permisos.findIndex(i => i._id === permiso._id);
        if (index > -1) {
            this.selectedUsuarioLocal.permisos.splice(index, 1);
        } else {
            this.selectedUsuarioLocal.permisos.push(permiso);
        }
    }

    cargarUsuario(f: NgForm) {
        this.usuarioService.createUsuario(this.username, this.nombre, this.apellido, this.password)
        .then((usuarioAgregado) => {
            // cierro el modal
            this.cerrarAgregar.nativeElement.click();

            // Muestro un mensajito de Agregado con Éxito
            Swal.fire({
                title: 'Agregado!',
                text: 'Se ha creado el usuario correctamente.',
                type: 'success',
                showConfirmButton: false,
                timer: 1200
            });

            // Agrego el Médico al Arreglo de Médicos (actualiza la tabla)
            this.usuarios.push(usuarioAgregado);

            // Reseteo el formulario/modal para que no haya nada en los input cuando se vuelva a abrir
            this.nombre = null;
            this.apellido = null;
            this.username = null;
            this.password = null;
            f.resetForm();
        });
    }

    generarUsername() {
        if (this.nombre && !this.apellido) {
            this.username = this.nombre.trim().toLowerCase() + '.';
        }
        if (!this.nombre && this.apellido) {
            this.username = this.apellido.trim().toLowerCase();
        }
        if (this.nombre && this.apellido) {
            this.username = this.nombre.trim().toLowerCase() + '.' + this.apellido.trim().toLowerCase();
        }
    }

    checkPermission(permisos) {
        return SecurityUtils.checkPermissions(permisos);
    }
}
