
import { View, Component } from 'angular2/core';
import { Location, RouteConfig, RouterLink, Router, CanActivate } from 'angular2/router';
import { CORE_DIRECTIVES, FORM_DIRECTIVES, FormBuilder, ControlGroup, Validators, Control } from 'angular2/common';
import { Http } from 'angular2/http';

import { urlEncode } from '../../app/urlEncoder';

@Component({
    selector: 'ManageRadiostation',
    templateUrl: './dest/settings/manageRadiostation/manageRadiostation.html',
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES]
})
export class ManageRadiostation {
    http: Http;
    myForm: ControlGroup;

    isFormDisabled: boolean;

    name: Control;
    description: Control;
    oib: Control;
    address: Control;
    email: Control;
    frequency: Control;

    nameModel: string;
    descriptionModel: string;
    oibModel: string;
    addressModel: string;
    emailModel: string;
    frequencyModel: string;

    onSubmit(value: String): void {
        this.http.post('http://localhost:5000/owner/station/modify', urlEncode({
            'name': this.nameModel,
            'description': this.descriptionModel,
            'oib': this.oibModel,
            'address': this.addressModel,
            'email': this.emailModel,
            'frequency': this.frequencyModel
        })).map((resp) => resp.text()).subscribe((resp) => console.log(resp));
    }

    constructor(fb: FormBuilder, http: Http) {
        this.http = http;

        this.name = new Control('lala', Validators.required);
        this.description = new Control('', Validators.required);
        this.oib = new Control('', Validators.required);
        this.address = new Control('', Validators.required);
        this.email = new Control('', Validators.required);
        this.frequency = new Control('', Validators.required);

        this.isFormDisabled = true;

        this.myForm = fb.group({
            'name': this.name,
            'description': this.description,
            'oib': this.oib,
            'address': this.address,
            'email': this.email,
            'frequency': this.frequency
        });

        this.http.get('http://localhost:5000/station/get').map((text) => text.json()).subscribe((response) => {
            let stationObj = response.data;
            console.log(stationObj);
            this.nameModel = stationObj.name;
            this.descriptionModel = stationObj.description;
            this.oibModel = stationObj.oib;
            this.addressModel = stationObj.address;
            this.emailModel = stationObj.email;
            this.frequencyModel = stationObj.frequency;
        });
    }
}
