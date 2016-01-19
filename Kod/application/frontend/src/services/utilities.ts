import { Http, URLSearchParams } from 'angular2/http';
import { FormBuilder, ControlGroup, Validators, Control } from 'angular2/common';


export function urlEncode(obj: Object): string {
    let urlSearchParams = new URLSearchParams();
    for (let key in obj) {
        if (0)
            urlSearchParams.append(key, urlEncode(obj[key]))
        else {
            urlSearchParams.append(key, obj[key]);
        } 
    }
    return urlSearchParams.toString();
}

export class Form {
    http: Http;

    submissionUrl: string;
    group: ControlGroup;
    controls: Control[];

    constructor(fb: FormBuilder, http: Http, controlNames: string[], submissionUrl: string, getter?: any) {
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
                this.http.get(getter).map((resp) => resp.json().data).subscribe((data) => {
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

    onSubmit(value: String): void {
        console.log(value);
        this.http.post(this.submissionUrl, urlEncode(value)).map((resp) => resp.json())
            .subscribe((resp) => console.log(resp), (err) => console.log(err));
    }
}