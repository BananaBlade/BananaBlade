
import { Component } from 'angular2/core';
import { Location, RouteConfig, RouterLink, Router, CanActivate } from 'angular2/router';
import { CORE_DIRECTIVES, FORM_DIRECTIVES, FormBuilder, ControlGroup, Validators, Control } from 'angular2/common';

import { HttpAdvanced, AuthService } from '../../services/services';

@Component({
    selector: 'ManageRadiostation',
    templateUrl: './dist/views/manageRadiostation/manageRadiostation.html',
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES]
})
export class ManageRadiostation {
    http: HttpAdvanced;
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
        this.http.postWithBothMsg('/owner/station/modify', value);
    }

    toggleEditing() {
        if (this.isOwner) this.isFormDisabled = !this.isFormDisabled;
    }

    constructor(fb: FormBuilder, http: HttpAdvanced, authService: AuthService) {
        this.http = http;

        this.isOwner = authService.isOwner();

        this.myForm = fb.group({
            'name': this.name,
            'description': this.description,
            'oib': this.oib,
            'address': this.address,
            'email': this.email,
            'frequency': this.frequency
        });

        this.resetRadiostation();
    }

    resetRadiostation() {
        this.isFormDisabled = true;
        this.http.get('/station/get', (response) => {
            let stationObj = response;
            console.log(stationObj);
            for (let name in stationObj) {
                this[name].updateValue(stationObj[name]);
            }
        });
    }
}
