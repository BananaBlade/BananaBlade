///<reference path='../../typings/tsd.d.ts'/>

import {View, Component} from 'angular2/angular2';
import {Location, RouteConfig, RouterLink, Router} from 'angular2/router';

import {LoggedInRouterOutlet} from './LoggedInOutlet';
import {Home} from '../home/home';
import {Login} from '../login/login';
import {Signup} from '../signup/signup';

//let template = require('./app.html');


@Component({
  selector: 'auth-app'
})
@View({
  templateUrl: './src/app/app.html',
  directives: [ LoggedInRouterOutlet ]
})
@RouteConfig([
  { path: '/',       redirectTo: '/home' },
  { path: '/home',   as: 'Home',   component: Home },
  //{ path: '/login',  as: 'Login',  component: Login },
  { path: '/signup', as: 'Signup', component: Signup }
])
export class App {
  constructor(public router: Router) {
  }
}
