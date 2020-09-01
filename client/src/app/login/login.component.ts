import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../auth/auth.service';
import { UsuarioService } from '../usuario/user.service';


@Component({
    templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    returnUrl: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,

        private userService: UsuarioService) { }

    ngOnInit() {
        // reset login status
        this.authenticationService.logout();

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
    }

    login() {
        this.loading = true;
        this.authenticationService.login(this.model.username, this.model.password)
            .subscribe(
                data => {
                    this.router.navigate([this.returnUrl]);
                    this.userService.getFullUser(JSON.parse(localStorage.getItem('currentUser'))._id).then(res => {
                        localStorage.setItem('fullUser', JSON.stringify(res));
                    });
                },
                error => {
                    this.loading = false;
                });
    }
}
