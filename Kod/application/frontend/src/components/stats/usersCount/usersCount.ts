import { Component } from 'angular2/core';
import { HttpAdvanced } from '../../../services/httpAdvanced';

@Component({
    selector : 'users-count',
    templateUrl : './dist/components/stats/usersCount/usersCount.html'
})
export class UsersCount{
    http : HttpAdvanced;
    count : number;

    constructor( http : HttpAdvanced ){
        this.http = http;
        this.http.getNoError('/stats/active_users/count', (res) => this.count = res.count);
    }
}
