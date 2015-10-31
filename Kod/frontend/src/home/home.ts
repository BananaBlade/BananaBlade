///<reference path='../../typings/tsd.d.ts'/>

import {Component, View, CORE_DIRECTIVES} from 'angular2/angular2';
import { Router } from 'angular2/router';
import {status, text} from '../utils/fetch'

//let styles = require('./home.css');
//let template = require('./home.html');


@Component({
  selector: 'home'
})
@View({
  directives: [CORE_DIRECTIVES],
  templateUrl: './src/home/home.html'//,
//  stylesUrl: './home.css'
})
export class Home {

}
