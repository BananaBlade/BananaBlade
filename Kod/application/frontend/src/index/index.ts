
import { View, Component } from 'angular2/core';
import { Location, RouteConfig, RouterLink, Router, CanActivate } from 'angular2/router';
import { Http } from 'angular2/http';

@Component({
    selector: 'Index'
})
@View({
    templateUrl: './dest/index/index.html'
})
export class Index {

    constructor(http: Http) {

    }
}