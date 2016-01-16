import { Component, Input } from 'angular2/core';
import { COMMON_DIRECTIVES, FORM_DIRECTIVES } from 'angular2/common';
import { ROUTER_DIRECTIVES } from 'angular2/router';
import 'rxjs/Rx';

import { getNavigationArray } from "../app/routingProvider";


@Component({
    selector: 'nav-bar',
    templateUrl: './dest/app/navBar.html',
    styles: [],
    directives: [ FORM_DIRECTIVES, COMMON_DIRECTIVES, ROUTER_DIRECTIVES ]
})
export class NavBar {
    @Input() accountType : number;
    navigation: any[];

    constructor(){
        this.navigation = getNavigationArray();
    }
}
