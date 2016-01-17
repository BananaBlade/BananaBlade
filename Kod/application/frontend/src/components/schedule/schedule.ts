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
        //setInterval( this.getItems, 1000 );
    }

    getItems(){
        console.log( 'Getting' );
        this.http.get( '/player/schedule' ).map( ( res ) => res.json() ).subscribe( ( res ) => {
            this.items = []
            for ( let i in res.data ){
                this.items.push( new ScheduleItem( res.data[ i ].editor, res.data[ i ].time ) )
            }
            console.log( this.items );
        }, ( err ) => console.log( err ) );
    }
}

class ScheduleItem{
    editor : string;
    time : Date;

    constructor( editor : string, time : string ){
        this.editor = editor;
        this.time = new Date( time );
    }

    timeString(){
        return "" + this.time.getHours() + ":" + ( this.time.getMinutes() < 10 ? '0' : '' ) + this.time.getMinutes();
    }
}
