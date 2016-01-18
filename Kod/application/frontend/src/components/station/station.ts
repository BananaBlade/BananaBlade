import { Component } from 'angular2/core';
import { Http } from 'angular2/http';

@Component({
    selector: 'station',
    templateUrl: '/dest/components/station/station.html'
})
export class Station{
    http : Http;
    name : string;
    oib : string;
    address : string;
    email : string;
    frequency : number;

    constructor( http : Http ){
        this.http = http;
        this.http.get( '/station/get' ).map( ( res ) => res.json() ).subscribe( ( res ) => {
            this.name = res.data.name;
            this.oib = res.data.oib;
            this.address = res.data.address;
            this.email = res.data.email;
            this.frequency = res.data.frequency;
        }, ( err ) => console.log( err ) );
    }
};
