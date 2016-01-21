import { Component } from 'angular2/core';
import { COMMON_DIRECTIVES } from 'angular2/common';
import { Http } from 'angular2/http';

@Component({
    selector : 'admins-list',
    templateUrl : './dest/components/stats/adminsList/adminsList.html',
    directives : [ COMMON_DIRECTIVES ]
})
export class AdminsList{
    http : Http;
    admins : string[] = [];

    constructor( http : Http ){
        this.http = http;
        this.http.get( '/stats/active_admins/list' ).subscribe(
            ( res ) => this.admins = res.json().data,
            ( err ) => console.log( err ) );
    }
}
