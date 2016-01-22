import { Http, URLSearchParams } from 'angular2/http';
import { FormBuilder, ControlGroup, Validators, Control } from 'angular2/common';
import { Injectable } from 'angular2/core';

import { HttpAdvanced } from './services';

export class Form {
    http: HttpAdvanced;

    submissionUrl: string;
    group: ControlGroup;
    controls: Control[];

    constructor(fb: FormBuilder, http: HttpAdvanced, controlNames: string[], submissionUrl: string, getter?: any) {
        this.http = http;
        this.submissionUrl = submissionUrl;

        let groupObj = new Object();
        for (let i in controlNames) {
            let control = new Control('', Validators.required);
            groupObj[controlNames[i]] = control;
        }
        this.group = fb.group(groupObj);

        if (getter) {
            if (typeof getter === "string") {
                this.http.get(getter, (data) => {
                    console.log(data);
                    for (let name in data) {
                        this.group.controls[name].value = data[name];
                        this.group.controls[name].updateValueAndValidity();
                    }
                });
            }
            else {
                for (let name in getter) {
                    this.group.controls[name].value = getter[name];
                    this.group.controls[name].updateValueAndValidity();
                    this.group.updateValueAndValidity();
                }
            }
        }
    }

    onSubmit(value: string): void {
        console.log(value);
        this.http.post(this.submissionUrl, value);
    }
}

@Injectable()
export class FormBuilderAdvanced {
    http: HttpAdvanced;
    fb: FormBuilder;

    constructor(fb: FormBuilder, http: HttpAdvanced) {
        this.fb = fb;
        this.http = http;
    }

    create(controlNames: string[], submissionUrl: string, getter?: any) {
        return new Form(this.fb, this.http, controlNames, submissionUrl, getter);
    }
}