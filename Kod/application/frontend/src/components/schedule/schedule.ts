import { Component } from 'angular2/core';
import { COMMON_DIRECTIVES } from 'angular2/common';
import { Http } from 'angular2/http';

@Component({
    selector: 'schedule',
    directives: [ COMMON_DIRECTIVES ],
    templateUrl: '/dest/components/schedule/schedule.html'
})
export class Schedule{
    items: any[] = [];
    http: Http;

    constructor( http : Http ){
        this.http = http;
        this.getItems();
    }

    getItems( self? : any ){
        if ( !self ) self = this;
        console.log( 'Getting' );
        self.http.get( '/player/schedule' ).map( ( res ) => res.json() ).subscribe( ( res ) => {
            self.items = []
            for ( let i in res.data ){
                self.items.push( new ScheduleItem( res.data[ i ].editor, res.data[ i ].time ) )
            }
        }, ( err ) => console.log( err ) );
        var dt : number;
        dt = 60 - ( new Date() ).getMinutes();
        if ( dt == 0 ) dt = 60;
        setTimeout( () => this.getItems( this ), dt * 60 * 1000 );
    }
}

class ScheduleItem{
    editor : string;
    time : string;

    constructor( editor : string, time : string ){
        this.editor = editor;
        this.time = time;
    }
}
