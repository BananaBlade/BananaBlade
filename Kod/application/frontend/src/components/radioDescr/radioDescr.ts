import { Component } from 'angular2/core';
import { HttpAdvanced } from '../../services/services'

@Component({
    selector : 'radio-descr',
    templateUrl : '/dist/components/radioDescr/radioDescr.html'
})

export class RadioDescr{
    http : HttpAdvanced;
    descr : string;

    constructor(http: HttpAdvanced) {
        this.http = http;
        this.http.getNoError('/station/get', ( res ) => {
            this.descr = res.description;
        });
    }
}
