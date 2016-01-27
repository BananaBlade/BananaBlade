import { Injectable, Inject } from 'angular2/core';

let MESSAGE_TEXT = "message_text";
let MESSAGE_TYPE = "message_type";

let INFO = "info";
let SUCCESS = "success";
let ERROR = "error";

let THIS: MsgService = null;

@Injectable()
export class MsgServiceInternal {
    message: string = "";

    constructor() {
        // FOR TESTING
        //setTimeout(() => this.setMessage("ASD"), 1000);
    }

    hasMessage() {
        let msg = this.getMessage();
        return !!msg.text;
    }

    setMessage(msg: any, type?: string) {
        let msg2 = typeof msg === "string" ? msg : JSON.stringify(msg);
        if ( !type ) type = INFO;
        sessionStorage.setItem(MESSAGE_TEXT, msg2);
        sessionStorage.setItem(MESSAGE_TYPE, type);
    }

    deleteMessage() {
        this.setMessage("");
    }

    getMessage() {
        let msg = sessionStorage.getItem(MESSAGE_TEXT);
        let type = sessionStorage.getItem(MESSAGE_TYPE);
        return { text: msg, type: type };
    }
}

@Injectable()
export class MsgService {
    msgServiceInternal: MsgServiceInternal;

    constructor( @Inject(MsgServiceInternal) msgServiceInternal: MsgServiceInternal) {
        this.msgServiceInternal = msgServiceInternal;
        THIS = this;
    }

    setMessage(msg: string, type?: string) {
        this.msgServiceInternal.setMessage(msg, type);
    }
}
