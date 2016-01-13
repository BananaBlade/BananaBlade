import { Component, View } from "angular2/core";
import { COMMON_DIRECTIVES } from "angular2/common";
import { Http } from "angular2/http";

import { RouteConfig, RouterLink, RouterOutlet, Route, ROUTER_DIRECTIVES, Router} from 'angular2/router';

import { HeaderBar } from '../App/HeaderBar';

//var routes = components.map((componentName) => { return new Route(componentName, componentName, componentName) });

import { getNavigationArray, getRouteConfig } from '../App/RoutingProvider';

@Component({
    selector: 'App',
    templateUrl: './dest/App/App.html',
    styles: [],
    directives: [ ROUTER_DIRECTIVES, COMMON_DIRECTIVES, HeaderBar ]
})
@RouteConfig(getRouteConfig())
export class App {
    router: Router;
    location: Location;
    navigation: any[];

    hideGroup(group): void {
        group.visible = !group.visible;
    }

    constructor(router: Router) {
        this.router = router;

        this.navigation = getNavigationArray();

        for (var i = 0; i < this.navigation.length; ++i) {
            this.navigation[i].visible = true;
        }
    };
}
