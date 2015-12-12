///<reference path='../../typings/tsd.d.ts'/>
import {
  Component,
  View,
  bootstrap,
  provide
} from "angular2/angular2";

import {
  RouteConfig,
  RouterLink,
  RouterOutlet,
  Route,
  ROUTER_DIRECTIVES,
  ROUTER_PROVIDERS,
  Location,
  LocationStrategy,
  HashLocationStrategy,
  Router
} from 'angular2/router';

import {Listen} from '../user/listen/listen';
import {Settings} from '../user/settings/settings';
import {Wishlist} from '../user/wishlist/wishlist';
import {Dev} from '../dev/dev';


@Component({
  selector: 'app',
  templateUrl: './dest/app/app.html',
  directives: [ ROUTER_DIRECTIVES ]
})
@RouteConfig([
  new Route({ path: '/',         as: 'Listen',   component: Listen   }), //redirectTo: '/Listen' }),
  //new Route({ path: '/Listen',   as: 'Listen',   component: Listen   }),
  new Route({ path: '/Settings', as: 'Settings', component: Settings }),
  new Route({ path: '/Wishlist', as: 'Wishlist', component: Wishlist }),
  new Route({ path: '/Dev', as: 'Dev', component: Dev })
])

export class App {

    router: Router;
    location: Location;

    constructor(router: Router, location: Location) {
        this.router = router;
        this.location = location;
    }

}

bootstrap(App, [ROUTER_PROVIDERS, provide(LocationStrategy, { useClass: HashLocationStrategy })]);