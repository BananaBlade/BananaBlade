import { Component, Input } from 'angular2/core';
import { COMMON_DIRECTIVES, FORM_DIRECTIVES } from 'angular2/common';
import { ROUTER_DIRECTIVES } from 'angular2/router';
import 'rxjs/Rx';

import { NavigationProvider } from "../../services/routingProvider";


@Component({
    selector: 'nav-bar',
    templateUrl: './dest/components/navBar/navBar.html',
    directives: [ FORM_DIRECTIVES, COMMON_DIRECTIVES, ROUTER_DIRECTIVES ]
})
export class NavBar {
    @Input() accountType : number;
    navigation: any[];

    constructor(){
        this.navigation = NavigationProvider.getNavigationArray();
    }

    isVisible( at : number ){
        return ( ( 1 << this.accountType ) & at ) != 0;
    }
}
