import { Component, View } from "angular2/core";
import { COMMON_DIRECTIVES } from "angular2/common";
import { Http } from "angular2/http";
import { RouteConfig, RouterLink, RouterOutlet, Route, ROUTER_DIRECTIVES, Router} from 'angular2/router';

import { HeaderBar } from './components/headerBar/headerBar';
import { Messages } from './components/messages/messages';

import { Index } from './views/index/index';
import { Settings } from './settings';

import { MsgService } from './services/services';

@Component({
    selector: 'App',
    templateUrl: './dest/app.html',
    styles: [],
    directives: [ ROUTER_DIRECTIVES, COMMON_DIRECTIVES, HeaderBar, Messages ]
})
@RouteConfig([
    { path: '/', name: 'Index', component: Index, useAsDefault: true },
    { path: '/settings/...', name: 'Settings', component: Settings }
])
export class App {
    router: Router;
    location: Location;

    constructor(router: Router) {
        this.router = router;
    };
}
