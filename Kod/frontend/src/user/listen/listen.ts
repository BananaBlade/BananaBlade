///<reference path='../../../typings/tsd.d.ts'/>

import {View, Component} from 'angular2/angular2';
import {Location, RouteConfig, RouterLink, Router} from 'angular2/router';

@Component({
  selector: 'listen'
})
@View({
  templateUrl: './dest/user/listen/listen.html'
})

export class Listen {
  constructor(public router: Router) {
  }
}
