import { Injectable, Inject  } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';

import {Router} from '@angular/router';
import {Config} from '../config';
import { UrlService } from '../window.provider.service';

@Injectable()
export class AuthenticationService {
    private headers = new Headers({'Content-Type': 'application/json'});
    private loginURL = this.urlService.getRestApiUrl() + '/login';  // URL to web api
    constructor(private http: Http, private router: Router,
                private urlService: UrlService) { }

    login(usernam: string, pass: string) {
        return this.http
        .post(this.loginURL, JSON.stringify({ username: usernam, password: pass }), {headers: this.headers})
        .map((response: Response) => {
            // login successful if there's a jwt token in the response
            const user = response.json();
            if (user && user.token) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                user.username = usernam;
                localStorage.setItem('currentUser', JSON.stringify(user));
            }
        });
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.router.navigate(['/login']);
    }
}
