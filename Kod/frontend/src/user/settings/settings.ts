///<reference path='../../../typings/tsd.d.ts'/>

import {View, Component} from 'angular2/angular2';
import {Location, RouteConfig, RouterLink, Router} from 'angular2/router';

@Component({
	selector: 'settings'
})
@View({
  templateUrl: './dest/user/settings/settings.html'
})

export class Settings {
	constructor(public router: Router) {
	}
}
