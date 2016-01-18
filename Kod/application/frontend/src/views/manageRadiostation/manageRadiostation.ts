
import { View, Component } from 'angular2/core';
import { Location, RouteConfig, RouterLink, Router, CanActivate } from 'angular2/router';
import { CORE_DIRECTIVES, FORM_DIRECTIVES, FormBuilder, ControlGroup, Validators, Control } from 'angular2/common';
import { Http } from 'angular2/http';

import { urlEncode } from '../../services/utilities';
import { AuthService } from '../../services/authService';

@Component({
    selector: 'ManageRadiostation',
    templateUrl: './dest/views/manageRadiostation/manageRadiostation.html',
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES]
})
export class ManageRadiostation {
    http: Http;
    myForm: ControlGroup;

    isFormDisabled: boolean;

    name: Control = new Control('', Validators.required);
    description: Control = new Control('', Validators.required);
    oib: Control = new Control('', Validators.required);
    address: Control = new Control('', Validators.required);
    email: Control = new Control('', Validators.required);
    frequency: Control = new Control('', Validators.required);

    isOwner: boolean = false;

    onSubmit(value: String): void {
        console.log(value);
        this.http.post('/owner/station/modify', urlEncode(value)).map((resp) => resp.text()).subscribe((resp) => console.log(resp), (err) => console.log(err));
    }

    toggleEditing() {
        if (this.isOwner) this.isFormDisabled = !this.isFormDisabled;
    }

    constructor(fb: FormBuilder, http: Http, authService: AuthService) {
        this.http = http;

        this.isOwner = authService.isOwner();

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