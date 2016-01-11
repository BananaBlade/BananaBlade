

import {View, Component} from 'angular2/core';
import {Location, RouteConfig, RouterLink, Router} from 'angular2/router';
import {AuthHttp, tokenNotExpired, JwtHelper} from 'angular2-jwt';

declare var Auth0Lock;

@Component({
    selector: 'AccountLogin',
    template: `
    <h1>Welcome to Angular2 with Auth0</h1>
    <button *ngIf="!loggedIn()" (click)="login()">Login</button>
    <button *ngIf="loggedIn()" (click)="logout()">Logout</button>
  `
})
export class AccountLogin {
    lock = new Auth0Lock('9MZBhjM9RwmZSXcFFWvoc2PKcqzwCpIz', 'bananablade.eu.auth0.com');

    constructor() { }

    login() {
        this.lock.show(function(err: string, profile: string, id_token: string) {
            if (err) {
                throw new Error(err);
            }
            localStorage.setItem('profile', JSON.stringify(profile));
            localStorage.setItem('id_token', id_token);
        });
    }

    logout() {
        localStorage.removeItem('profile');
        localStorage.removeItem('id_token');
    }

    loggedIn() {
        return tokenNotExpired();
    }
}