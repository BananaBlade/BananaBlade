import { Component, View, provide } from "angular2/core";

import { RouteConfig, RouterLink, RouterOutlet, Route, ROUTER_DIRECTIVES, ROUTER_PROVIDERS
       , Location, LocationStrategy, HashLocationStrategy, Router 
} from 'angular2/router';

import { bootstrap } from 'angular2/platform/browser';

import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app',
  templateUrl: './dest/header/header.html',
  directives: [ ROUTER_DIRECTIVES ]
})
@RouteConfig([
  new Route({ path: '...',        name: 'Navbar',     component: Navbar })
])
export class Header {
    router: Router;
    location: Location;

    constructor(router: Router, location: Location) {
        this.router = router;
        this.location = location;
    }
}

bootstrap(Header, [ ROUTER_PROVIDERS
                  , provide( LocationStrategy
                           , { useClass: HashLocationStrategy }
)]);