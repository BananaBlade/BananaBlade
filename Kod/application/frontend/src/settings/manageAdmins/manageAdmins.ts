
import { View, Component } from 'angular2/core';
import { Location, RouteConfig, RouterLink, Router, CanActivate } from 'angular2/router';
import { Http } from 'angular2/http';

@Component({
  selector: 'ManageAdmins'
})
@View({
    templateUrl: './dest/settings/manageAdmins/manageAdmins.html'
})
export class ManageAdmins {
    
    constructor(http: Http) {

        http.get('/owner/admins/list').map((res) => res.json()).subscribe((res) =>
            console.log(res));
    }
}