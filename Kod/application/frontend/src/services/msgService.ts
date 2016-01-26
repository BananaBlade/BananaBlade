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
        let msg = sessionStorage.getItem( MESSAGE );
        return !!msg && !!msg.messageText;
    }

    setMessage(msg: string, type?: string) {
        if ( !type ) type = "info";
        sessionStorage.setItem( MESSAGE, this.encode( msg, type ) );
    }

    deleteMessage() {
        this.setMessage("");
    }

    getMessage() {
        return this.decode( sessionStorage.getItem( MESSAGE ) );
    }

    encode( msg : string, type : string ){
        return type + ':' + msg;
    }

    decode( encoded : string ){
        var x = encoded.split( ':', 1 ), res;
        res.messageType = x[ 0 ];
        res.messageText = x[ 1 ];
        console.log( 'Decoding ' + encoded + ' => ' + res );
        return res;
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
