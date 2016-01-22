import { Injectable } from 'angular2/core';
import { Http } from 'angular2/http';

import { MsgService, urlEncode } from './services'

@Injectable()
export class HttpAdvanced {
    msgService: MsgService;
    http: Http;

    constructor(msgService: MsgService, http: Http) {
        this.msgService = msgService;
        this.http = http;
    }

    /*
     * This is for plain ol' GET requests .. with callback of course.
     */
    public get(url, callback) {
        return this.http.get(url).subscribe((res) => {
            let data = res.json().data;
            callback(data);
        }, this.msgService.httpErrorHandler);
    }

    /*
     * This is for POST request WITHOUT callback.
     * (Simply the positive response will be logged to console and 
     *  negative to msgService)
     */
    public post(url, data) {
        return this.http.post(url, urlEncode(data)).subscribe((res) => {
            let data = res.json().data;
            console.log(data);
        }, this.msgService.httpErrorHandler);
    }

    /*
     * This is for making POST requests which plan on executing a callback.
     */
    public postWithRes(url, data, callback) {
        return this.http.post(url, urlEncode(data)).subscribe((res) => {
            let data = res.json().data;
            callback(data);
        });
    }
}