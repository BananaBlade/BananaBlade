import { Component } from 'angular2/core';
import { COMMON_DIRECTIVES } from 'angular2/common';

import { HttpAdvanced } from './../../services/services';

@Component({
    selector: 'schedule',
    directives: [ COMMON_DIRECTIVES ],
    templateUrl: '/dist/components/schedule/schedule.html'
})
export class Schedule{
    items: any[] = [];
    http: HttpAdvanced;

    constructor( http : HttpAdvanced ){
        this.http = http;
        this.getItems();
    }

    getItems(self? : any){
        if (!self) self = this;
        self.http.get('/player/schedule', (res) => {
            console.log( res )
            self.items = []
            for ( let i in res ){
                self.items.push( new ScheduleItem( res[ i ].editor, res[ i ].time ) )
            }
        });
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
