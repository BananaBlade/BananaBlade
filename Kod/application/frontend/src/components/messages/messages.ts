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
    shown : boolean;

    constructor(){}

    ngOnInit(){
        if ( this.messageText != undefined )
            this.show();
    }

    show(){
        this.shown = true;
        setTimeout( this.hideFactory, 100 );
    }

    hideFactory(){
        return () => this.hide( this );
    }

    hide( self? : any ){
        if ( !self ) self = this;
        console.log( 'Hide' );
        self.shown = false;
    }

    ngOnChange( x : any ){
        console.log( x );
        this.show();
    }
}
