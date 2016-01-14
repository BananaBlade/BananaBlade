import { Component, Input } from 'angular2/core';
import {
    COMMON_DIRECTIVES
} from 'angular2/common';
import 'rxjs/Rx';

@Component({
    selector: 'nav-bar',
    templateUrl: './dest/app/navBar.html',
    styles: [],
    directives: [ FORM_DIRECTIVES, COMMON_DIRECTIVES ]
})
export class NavBar {
    @Input() accountType : number;

    constructor(){}
}
