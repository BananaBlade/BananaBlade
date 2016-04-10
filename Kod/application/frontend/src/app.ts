import { Component } from "angular2/core";
import { COMMON_DIRECTIVES } from "angular2/common";
import { Http } from "angular2/http";
import { RouteConfig, RouterLink, RouterOutlet, Route, ROUTER_DIRECTIVES, Router, Location} from 'angular2/router';

import { HeaderBar } from './components/headerBar/headerBar';
import { Messages } from './components/messages/messages';

import { Index } from './views/index/index';
import { Settings } from './settings';

import { MsgService } from './services/services';

@Component({
    selector: 'App',
    templateUrl: './dist/app.html',
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

    constructor(router: Router, location: Location) {
        this.router = router;

        // SOME OTHER DAY. Trying to fix not loading of lazy nested routes.
        // let currPath = location.path();
        // console.log(currPath);
        // if (currPath != '/' && currPath) {
        //     console.log('q');
        //     let parts = currPath.split('/');
        //     let rest = '/' + parts.slice(2).join('/');
        //     console.log(rest);
        //     setTimeout(() => router.navigateByUrl(currPath), 500);
        //     router.renavigate().then(() => console.log('rena'));
        //}
    };
}
