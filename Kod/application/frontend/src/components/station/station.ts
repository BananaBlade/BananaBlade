import { Component } from 'angular2/core';
import { HttpAdvanced } from '../../services/services';

@Component({
    selector: 'station',
    templateUrl: '/dest/components/station/station.html'
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
            this.name = res.data.name;
            this.oib = res.data.oib;
            this.address = res.data.address;
            this.email = res.data.email;
            this.frequency = res.data.frequency;
        });
    }
};
