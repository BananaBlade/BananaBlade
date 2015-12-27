
import {View, Component} from 'angular2/core';
import {Location, RouteConfig, RouterLink, Router, CanActivate} from 'angular2/router';
import {AuthHttp, tokenNotExpired, JwtHelper} from 'angular2-jwt';

@Component({
    selector: 'AccountDelete'
})
@View({
        templateUrl: './dest/Settings/AccountDelete/AccountDelete.html'
})
@CanActivate(() => tokenNotExpired())
export class AccountDelete {

}