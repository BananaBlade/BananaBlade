import { Component } from 'angular2/core';
import { Http } from 'angular2/http';

@Component({
    selector : 'users-count',
    templateUrl : './dest/components/stats/usersCount/usersCount.html'
})
export class UsersCount{
    http : Http;
    count : number;

    constructor( http : Http ){
        this.http = http;
        this.http.get( '/stats/active_users/count' ).subscribe( ( res ) => this.count = res.json().data.count, ( err ) => console.log( err ) );
    }
}
