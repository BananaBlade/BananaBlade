import { URLSearchParams } from 'angular2/http';

export function urlEncode(obj: Object): string {
    let urlSearchParams = new URLSearchParams();
    for (let key in obj) {
        urlSearchParams.append(key, obj[key]);
    }
    return urlSearchParams.toString();
}