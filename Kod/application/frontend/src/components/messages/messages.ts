import { Component, Input } from 'angular2/core';
import { COMMON_DIRECTIVES } from 'angular2/common';

import { MsgServiceInternal } from '../../services/services';

@Component({
    selector : 'messages',
    directives : [ COMMON_DIRECTIVES ],
    templateUrl : 'dist/components/messages/messages.html'
})
export class Messages{
    messageType : string;
    messageText : string;
    shown : boolean = false;
    listenTimeoutInterval: number;
    displayTimeoutInterval: number;

    messageService: MsgServiceInternal;

    constructor(msgServiceInternal: MsgServiceInternal){
        this.shown = false;
        this.listenTimeoutInterval = 100;
        this.displayTimeoutInterval = 2100;
        this.messageService = msgServiceInternal;
        this.watchForMessage(this);
    }

    displayMessage() {
        console.log( this.messageType, this.messageText );
        this.show();
    }

    watchForMessage(self: Messages) {
        let msgService: MsgServiceInternal = self.messageService;
        let hasMessage = msgService.hasMessage();
        if (hasMessage)
        {
            var message = msgService.getMessage();
            self.messageType = message.type;
            self.messageText = message.text;
            msgService.deleteMessage();
            setTimeout(() => self.watchForMessage(self), self.displayTimeoutInterval);
            self.displayMessage();
        }
        else {
            setTimeout(() => self.watchForMessage(self), self.listenTimeoutInterval);
        }
    }

    /*ngOnInit(){
        if ( this.messageText.length > 0 && this.messageType > 0 ) this.show();
        else this.shown = false;
    }*/

    show(){
        this.shown = true;
        setTimeout(() => this.hide(this), 5000);
    }

    hide( self? : any ){
        if ( !self ) self = this;
        self.shown = false;
    }

    /*ngOnChanges( x : any ){
        this.show();
    }*/
}
