import { Component, View, provide } from "angular2/core";

import { RouteConfig, RouterLink, RouterOutlet, Route, ROUTER_DIRECTIVES, ROUTER_PROVIDERS
, Location, LocationStrategy, HashLocationStrategy, Router
} from 'angular2/router';

import { bootstrap } from 'angular2/platform/browser';

import { AccountData } from '../settings/AccountData/AccountData';
import { AccountDelete } from '../settings/AccountDelete/AccountDelete';
import { AccountPassword } from '../settings/AccountPassword/AccountPassword';
import { AddTrack } from '../settings/AddTrack/AddTrack';
import { AccountLogin } from '../settings/AccountLogin/AccountLogin';


@Component({
    selector: 'App',
    templateUrl: './dest/App/App.html',
    directives: [ROUTER_DIRECTIVES]
})

@RouteConfig([
    new Route({ path: '/', name: 'AccountData', component: AccountData }),
    new Route({ path: 'AccountPassword', name: 'AccountPassword', component: AccountPassword }),
    new Route({ path: 'AccountDelete', name: 'AccountDelete', component: AccountDelete }),
    new Route({ path: 'AddTrack', name: 'AddTrack', component: AddTrack }),
    new Route({ path: 'AccountLogin', name: 'AccountLogin', component: AccountLogin })
])

export class App {
    router: Router;
    location: Location;

    constructor(router: Router) {
        this.router = router;
    }
}

bootstrap(App, [ROUTER_PROVIDERS
    , provide(LocationStrategy
        , { useClass: HashLocationStrategy }
    )]);