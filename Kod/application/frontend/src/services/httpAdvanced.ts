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
                if (res.json().data) {
                    if (res.json().data.success_message) console.log(res.json().data.success_message);
                    else console.log(res.json().data);
                }
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
                console.log(res.json());
                if (res.json().data) callback(res.json().data);
                else callback(res.json());
            }
            else callback(res);
        }, this.msgService.httpErrorHandler);
    }

    public postWithBothMsg(url, data, callback?) {
        return this.http.post(url, urlEncode(data)).subscribe((res) => {
            if (res.json) {
                console.log(res.json());
                if (res.json().data) {
                    this.msgService.setMessage(res.json().data);
                    if (callback) callback(res.json().data);
                }
                if (res.json().success_message) {
                    this.msgService.setMessage(res.json().success_message);
                    if (callback) callback(res.json());
                }
                else {
                    this.msgService.setMessage(res.json());
                    if (callback) callback(res.json());
                }
            }
            else {
                if (callback) callback(res);
            }
        }, this.msgService.httpErrorHandler);
    }

    public postPure(url, data, callback?) {
        return this.http.post(url, data).subscribe((res) => {
            if (res.json) {
                console.log(res.json());
                if (res.json().data) {
                    this.msgService.setMessage(res.json().data);
                    if (callback) callback(res.json().data);
                }
                if (res.json().success_message) {
                    this.msgService.setMessage(res.json().success_message);
                    if (callback) callback(res.json());
                }
                else {
                    this.msgService.setMessage(res.json());
                    if (callback) callback(res.json());
                }
            }
            else {
                if (callback) callback(res);
            }
        }, this.msgService.httpErrorHandler);
    }
}