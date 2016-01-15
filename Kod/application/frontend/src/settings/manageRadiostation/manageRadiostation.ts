
import { View, Component } from 'angular2/core';
import { Location, RouteConfig, RouterLink, Router, CanActivate } from 'angular2/router';
import { CORE_DIRECTIVES, FORM_DIRECTIVES, FormBuilder, ControlGroup, Validators, Control } from 'angular2/common';
import { Http } from 'angular2/http';

import { urlEncode } from '../../utilities';

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

    onSubmit(value: String): void {
        console.log(value);
        this.http.post('/owner/station/modify', urlEncode(value)).map((resp) => resp.text()).subscribe((resp) => console.log(resp), (err) => console.log(err));
    }

    constructor(fb: FormBuilder, http: Http) {
        this.http = http;

        this.name = new Control('', Validators.required);
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

        this.http.get('/station/get').map((text) => text.json()).subscribe((response) => {
            let stationObj = response.data;
            console.log(stationObj);
            for (let name in stationObj) {
                this[name].updateValue(stationObj[name]);
            }
        }, (err) => console.log(err));
    }
}