import {HTTP_PROVIDERS} from 'angular2/http';
import {Component, View, bootstrap, provide} from 'angular2/angular2';
import {ROUTER_DIRECTIVES, RouteConfig, Location, ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy, Route, AsyncRoute, Router} from 'angular2/router';

import {Listen} from './user/listen';
import {Wishlist} from './user/wishlist';
import {Settings} from './user/settings';

@Component({
    selector: 'sartzapp',
    templateUrl: `./navbar.html`,
    directives: [Listen, Wishlist, Settings, ROUTER_DIRECTIVES]
})

@RouteConfig([
  new Route({path: '/', component: Listen, as: 'Listen'}),
  new Route({path: '/wishlist', component: Wishlist, as: 'Wishlist'}),
  new Route({path: '/settings', component: Settings, as: 'Settings'})
])

class AppComponent {
  router: Router;
  location: Location;

  constructor(router: Router, location: Location) {
      this.router = router;
      this.location = location;
  }
}

bootstrap(AppComponent, [ROUTER_PROVIDERS, HTTP_PROVIDERS,
          provide(LocationStrategy, {useClass: HashLocationStrategy})]);
