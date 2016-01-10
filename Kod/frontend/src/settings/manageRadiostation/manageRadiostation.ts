
import { View, Component } from 'angular2/core';
import { Location, RouteConfig, RouterLink, Router, CanActivate } from 'angular2/router';
import { CORE_DIRECTIVES, FORM_DIRECTIVES, FormBuilder, ControlGroup, Validators, Control } from 'angular2/common';
import { Http } from 'angular2/http';

@Component({
    selector: 'ManageRadiostation',
    templateUrl: './dest/Settings/ManageRadiostation/ManageRadiostation.html',
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES]
})
export class ManageRadiostation {
    myForm: ControlGroup;

    firstName: Control;
    description: Control;
    oib: Control;
    address: Control;
    email: Control;
    frequency: Control;

    firstNameModel: string;
    descriptionModel: string;
    oibModel: string;
    addressModel: string;
    emailModel: string;
    frequencyModel: string;

    onSubmit(value: String): void {

    }

    constructor(fb: FormBuilder) {

        this.firstName = new Control('', Validators.required);
        this.description = new Control('', Validators.required);
        this.oib = new Control('', Validators.required);
        this.address = new Control('', Validators.required);
        this.email = new Control('', Validators.required);
        this.frequency = new Control('', Validators.required);

        this.myForm = fb.group({
            'firstName': this.firstName,
            'description': this.description,
            'oib': this.oib,
            'address': this.address,
            'email': this.email,
            'frequency': this.frequency
        });

    }
}