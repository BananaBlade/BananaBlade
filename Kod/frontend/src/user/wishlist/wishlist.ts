///<reference path='../../../typings/tsd.d.ts'/>

import {View, Component} from 'angular2/angular2';
import {Location, RouteConfig, RouterLink, Router} from 'angular2/router';

@Component({
	selector: 'wishlist'
})
@View({
		templateUrl: './dest/user/wishlist/wishlist.html'
})

export class Wishlist {
	constructor(public router: Router) {
	}
}
