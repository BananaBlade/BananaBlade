import { Http, URLSearchParams } from 'angular2/http';
import { FormBuilder, ControlGroup, Validators, Control } from 'angular2/common';
import { Injectable } from 'angular2/core';

import { HttpAdvanced } from './services';

interface Dict<T> {
    [K: string]: T;
}

export class Form {
    http: HttpAdvanced;

    submissionUrl: string;
    group: ControlGroup;
    controls: Dict<Control>;

    constructor(fb: FormBuilder, http: HttpAdvanced, controlNames: string[], submissionUrl: string, getter?: any) {
        this.http = http;
        this.submissionUrl = submissionUrl;

        // Create the controls object
        let groupObj: Dict<Control> = {};
        for (let i in controlNames) {
            let control = new Control('', Validators.required);
            groupObj[controlNames[i]] = control;
        }
        // Create a ControlGroup from the dict of Controls
        this.group = fb.group(groupObj);
        // Assign the Controls Object
        this.controls = groupObj;

        if (getter) {
            // If getter is a string then it's meant to fetch the values via http GET
            if (typeof getter === "string") {
                this.http.get(getter, (data) => {
                    console.log(data);
                    for (let name in data) {
                        this.controls[name].updateValue(data[name]);
                        //this.group.controls[name].value = data[name];
                        //this.group.controls[name].updateValueAndValidity();
                    }
                });
            }
            // Else it's an array
            else {
                for (let name in getter) {
                    this.controls[name].updateValue(getter[name]);
                    // this.group.controls[name].value = getter[name];
                    // this.group.controls[name].updateValueAndValidity();
                    // this.group.updateValueAndValidity();
                }
            }
        }
    }

    onSubmit(values: string): void {
        this.http.post(this.submissionUrl, values);
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