import { Injectable, Inject } from 'angular2/core';

let MESSAGE = "message";

let THIS = null;

@Injectable()
export class MsgServiceInternal {
    message: string = "";

    constructor() {
        // FOR TESTING
        //setTimeout(() => this.setMessage("ASD"), 1000);
    }

    hasMessage() {
        let does = !!sessionStorage.getItem(MESSAGE);
        return does;
    }

    setMessage(msg: string) {
        sessionStorage.setItem(MESSAGE, msg);
    }

    deleteMessage() {
        this.setMessage("");
    }

    getMessage() {
        return sessionStorage.getItem(MESSAGE);
    }
}

@Injectable()
export class MsgService {
    msgServiceInternal: MsgServiceInternal;

    constructor( @Inject(MsgServiceInternal) msgServiceInternal: MsgServiceInternal) {
        this.msgServiceInternal = msgServiceInternal;
        THIS = this;
    }

    setMessage(msg: string) {
        console.log(msg);
        this.msgServiceInternal.setMessage(msg);
    }

    httpErrorHandler(err) {
        if (typeof err === "string") THIS.setMessage(err);
        else {
            // Check if the 'err' can be stringified with .text
            if (err.json) {
                if(err.json().error_message) {
                    THIS.setMessage(err.json().error_message);
                }
                else {
                    THIS.setMessage(err.json());
                }
            }
            else if (err.text) {
                THIS.setMessage(err.text());
            }
            else {
                THIS.setMessage(JSON.stringify(err));
            }
        }
    }
}
