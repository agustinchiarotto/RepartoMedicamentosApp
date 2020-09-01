import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/auth/auth.service';
import { SecurityUtils } from 'src/app/SecurityUtils';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

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
