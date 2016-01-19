import { Component, Input } from 'angular2/core';
import { COMMON_DIRECTIVES } from 'angular2/common';

@Component({
    selector : 'messages',
    directives : [ COMMON_DIRECTIVES ],
    templateUrl : 'dest/components/messages/messages.html'
})
export class Messages{
    @Input( 'type' ) messageType : number;
    @Input( 'text' ) messageText : string;
    shown : boolean = false;

    constructor(){
        this.shown = false;
    }

    ngOnInit(){
        if ( this.messageText.length > 0 && this.messageType > 0 ) this.show();
        else this.shown = false;
    }

    show(){
        this.shown = true;
        setTimeout( () => this.hide( this ), 5000 );
    }

    hide( self? : any ){
        if ( !self ) self = this;
        self.shown = false;
    }

    ngOnChanges( x : any ){
        this.show();
    }
}
