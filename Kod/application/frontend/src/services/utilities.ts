import { Http, URLSearchParams } from 'angular2/http';
import { FormBuilder, ControlGroup, Validators, Control } from 'angular2/common';

import { HttpAdvanced } from './services';

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

/// In case the number is 1 digit, make it 2 digits. (Used for calendar numbers)
export function numberTo2digits(num) {
    let num2 = typeof num === "string" ? num : num.toString();

    return num2.length === 1 ? '0' + num2 : num2;
}