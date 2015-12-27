
import {View, Component} from 'angular2/core';
import {Location, RouteConfig, RouterLink, Router, CanActivate} from 'angular2/router';
import {AuthHttp, tokenNotExpired, JwtHelper} from 'angular2-jwt';

@Component({
    selector: 'AccountData'
})
@View({
        templateUrl: './dest/Settings/AccountData/AccountData.html'
})
export class AccountData {

}