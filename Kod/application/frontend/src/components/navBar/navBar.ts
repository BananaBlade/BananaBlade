import { Component, Input } from 'angular2/core';
import { COMMON_DIRECTIVES, FORM_DIRECTIVES } from 'angular2/common';
import { ROUTER_DIRECTIVES, Router } from 'angular2/router';

import { NavigationProvider, AuthService } from '../../services/services';


@Component({
    selector: 'nav-bar',
    templateUrl: './dest/components/navBar/navBar.html',
    directives: [ FORM_DIRECTIVES, COMMON_DIRECTIVES, ROUTER_DIRECTIVES ]
})
export class NavBar {
    authService: AuthService;
    router: Router;
    navigation: any[];

    constructor(authService: AuthService, router: Router){
        this.authService = authService;
        this.navigation = NavigationProvider.getNavigationArray();
    }

    isVisible( at : number ){
        return ( ( 1 << this.authService.getAuthLevel() ) & at ) != 0;
    }

    logout() {
        this.authService.logout(() => this.router.navigate(['/Index']));
    }
}
