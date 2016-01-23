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
     * GET without logging to message service.
     */
    public getNoError(url, callback) {
        return this.http.get(url).subscribe((res) => {
            let data = res.json().data;
            callback(data);
        }, (err) => {
            console.log("err:");
            console.log(err);
        });
    }

    /*
     * This is for POST request WITHOUT callback.
     * (Simply the positive response will be logged to console and 
     *  negative to msgService)
     */
    public post(url, data) {
        return this.http.post(url, urlEncode(data)).subscribe((res) => {
            if (res.json) {
                if (res.json().data) console.log(res.json().data);
                else console.log(res.json());
            }
            else console.log(res);
        }, this.msgService.httpErrorHandler);
    }

    /*
     * This is for making POST requests which plan on executing a callback.
     */
    public postWithRes(url, data, callback) {
        return this.http.post(url, urlEncode(data)).subscribe((res) => {
            if (res.json) {
                if (res.json().data) callback(res.json().data);
                else callback(res.json());
            }
            else callback(res);
        }, this.msgService.httpErrorHandler);
    }

    public postWithBothMsg(url, data) {
        this.postWithRes(url, data, (res) => {
            if (res.success_response) this.msgService.setMessage(res.success_response);
        });
    }
}