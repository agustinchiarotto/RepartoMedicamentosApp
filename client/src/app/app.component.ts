import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './auth/auth.service';
import { UsuarioService } from './usuario/user.service';
import { SecurityUtils } from './SecurityUtils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app works!';
  constructor(private authService: AuthenticationService) {
  }

  ngOnInit() {
  }

  estaLogueado() {
    return localStorage.getItem('currentUser');

  }
  getUsername() {
    let username = JSON.parse(localStorage.getItem('currentUser')).username;
    username = username.replace('.', ' ');
    return username;
  }
  logout() {
    this.authService.logout();
  }
  getToken() {
    const user = localStorage.getItem('fullUser');
    if (user) {
      return JSON.parse(user).permisos;
    } else {
      return '';
    }
  }
  checkPermission(permisos) {
    return SecurityUtils.checkPermissions(permisos);
  }
}
