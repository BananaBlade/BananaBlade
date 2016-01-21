import { Component, Input } from 'angular2/core';
import { COMMON_DIRECTIVES } from 'angular2/common';

import { MessageServiceInternal } from '../../services/messageService';

@Component({
    selector : 'messages',
    directives : [ COMMON_DIRECTIVES ],
    templateUrl : 'dest/components/messages/messages.html'
})
export class Messages{
    messageType : number;
    messageText : string;
    shown : boolean = false;
    listenTimeoutInterval: number;
    displayTimeoutInterval: number;

    messageService: MessageServiceInternal;

    constructor(){
        this.shown = false;
        this.listenTimeoutInterval = 100;
        this.displayTimeoutInterval = 2100;
        this.messageService = new MessageServiceInternal();
        this.watchForMessage(this);
    }

    displayMessage() {
        this.show();
    }

    watchForMessage(self: Messages) {
        let msgService: MessageServiceInternal = self.messageService;
        let msg: string = "";
        if (msgService.hasMessage())
        {
            self.messageText = msgService.getMessage();
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
        setTimeout( () => this.hide( this ), 5000 );
    }

    hide( self? : any ){
        if ( !self ) self = this;
        self.shown = false;
    }

    /*ngOnChanges( x : any ){
        this.show();
    }*/
}
