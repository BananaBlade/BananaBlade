import { Component} from "angular2/core";
import { COMMON_DIRECTIVES } from "angular2/common";
import { Http } from "angular2/http";
import { RouteConfig, RouterLink, RouterOutlet, Route, ROUTER_DIRECTIVES, Router} from 'angular2/router';

import { NavigationProvider } from './services/routingProvider';
import { NavBar } from "./components/navBar/navBar";


@Component({
    selector: 'Settings',
    template: `<nav-bar></nav-bar><router-outlet></router-outlet>`,
    directives: [ ROUTER_DIRECTIVES, NavBar ]
})
@RouteConfig( NavigationProvider.getRouteConfig() )
export class Settings {
    router: Router;

    constructor(router: Router) {
        this.router = router;
    }
}
