

import {View, Component} from 'angular2/core';
import {Location, RouteConfig, RouterLink, Router} from 'angular2/router';

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

    constructor() { }

    login() {
    }

    logout() {
    }

    loggedIn() {
    }
}
