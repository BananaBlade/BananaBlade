
import {View, Component} from 'angular2/core';
import {Location, RouteConfig, RouterLink, Router, CanActivate} from 'angular2/router';
import { Http } from 'angular2/http';

@Component({
    selector: 'EditorSlots',
    templateUrl: './dest/settings/editorSlots/editorSlots.html',
    directives: [ ]
})
export class EditorSlots {
    http: Http;
    days: string[] = ["Pon", "Uto", "Sri", "Čet", "Pet", "Sub", "Ned"];
    hours: number[] = new Array();

    today: Date = new Date();
    mondayDay: Date;

    slots: Slot[];

    constructor(http: Http) {
        this.http = http;
        for (let i = 9; i <= 20; ++i) {
            this.hours.push(i);
        }
        let secSinceMonday = this.today.getMilliseconds() + 1000 * (this.today.getSeconds() + 60 * (this.today.getMinutes() + 60 * (this.today.getHours() + 24 * ((this.today.getDay() + 6) % 7))));
        this.mondayDay = new Date(this.today.getTime() - secSinceMonday);
        console.log(this.mondayDay);

        http.get('/editor/slots/list').map((res) => res.json()).subscribe((res) => {
            console.log(res);
        }, (err) => console.log(err));
    }
}

class Slot {
    id: number;
    time: Date;
    count: number;
}