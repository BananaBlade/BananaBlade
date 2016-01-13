
import { View, Component } from 'angular2/core';
import { Location, RouteConfig, RouterLink, Router, CanActivate } from 'angular2/router';
import { CORE_DIRECTIVES, FORM_DIRECTIVES, FormBuilder, ControlGroup, Validators, Control } from 'angular2/common';
import { Http } from 'angular2/http';

import { Form } from '../../utilities';

@Component({
    selector: 'ManageRadiostation',
    templateUrl: './dest/settings/manageRadiostation/manageRadiostation.html',
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES]
})
export class ManageRadiostation {
    isFormDisabled: boolean;

    radioForm: Form;

    constructor(fb: FormBuilder, http: Http) {
        let radioFormNames = ['name', 'description', 'oib', 'address', 'email', 'frequency'];
        let submitUrl = '/owner/station/modify';
        let getUrl = '/station/get';
        this.radioForm = new Form(fb, http, radioFormNames, submitUrl, getUrl);

        this.isFormDisabled = true;
    }
}