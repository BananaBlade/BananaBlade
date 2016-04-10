import { Component } from 'angular2/core';
import { RouterLink } from 'angular2/router';
import { AuthService } from '../../services/authService';

@Component({
    directives: [ RouterLink ],
    templateUrl: 'dist/views/overview/overview.html'
})
export class Overview{
    authService : AuthService;

    constructor( authService: AuthService ){
        this.authService = authService;
    }
}
