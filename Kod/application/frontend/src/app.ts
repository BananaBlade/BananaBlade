import { Component, View } from "angular2/core";
import { COMMON_DIRECTIVES } from "angular2/common";
import { Http } from "angular2/http";
import { RouteConfig, RouterLink, RouterOutlet, Route, ROUTER_DIRECTIVES, Router} from 'angular2/router';

import { HeaderBar } from './components/headerBar/headerBar';
import { NavBar } from "./components/navbar/navbar";
import { getRouteConfig } from './services/routingProvider';
@Component({
    selector: 'App',
    templateUrl: './dest/app/app.html',
    styles: [],
    directives: [ ROUTER_DIRECTIVES, COMMON_DIRECTIVES, HeaderBar, NavBar ]
})
@RouteConfig(getRouteConfig())
export class App {
    router: Router;
    location: Location;

    constructor(router: Router) {
        this.router = router;
        router.navigate( [ 'Index' ] );
    };
}
