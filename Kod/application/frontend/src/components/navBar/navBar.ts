import { Component, Input } from 'angular2/core';
import { COMMON_DIRECTIVES, FORM_DIRECTIVES } from 'angular2/common';
import { ROUTER_DIRECTIVES } from 'angular2/router';
import 'rxjs/Rx';

import { NavigationProvider } from "../../services/routingProvider";
import { AuthService } from '../../services/authService';


@Component({
    selector: 'nav-bar',
    templateUrl: './dest/components/navBar/navBar.html',
    directives: [ FORM_DIRECTIVES, COMMON_DIRECTIVES, ROUTER_DIRECTIVES ]
})
export class NavBar {
    authService: AuthService;
    accountType : number;
    navigation: any[];

    constructor(authService: AuthService){
        this.authService = authService;
        this.accountType = authService.getAuthLevel();
        this.navigation = NavigationProvider.getNavigationArray();
    }

    isVisible( at : number ){
        return ( ( 1 << this.accountType ) & at ) != 0;
    }
}
