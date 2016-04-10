import { Component } from 'angular2/core';
import { HttpAdvanced } from '../../services/services';

@Component({
    selector: 'station',
    templateUrl: '/dist/components/station/station.html'
})
export class Station{
    http : HttpAdvanced;
    name : string;
    oib : string;
    address : string;
    email : string;
    frequency : number;

    constructor(http: HttpAdvanced) {
        this.http = http;
        this.http.get('/station/get', ( res ) => {
            this.name = res.name;
            this.oib = res.oib;
            this.address = res.address;
            this.email = res.email;
            this.frequency = res.frequency;
        });
    }
};
