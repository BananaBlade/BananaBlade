
import {View, Component} from 'angular2/core';
import {Location, RouteConfig, RouterLink, Router, CanActivate} from 'angular2/router';
import { Http } from 'angular2/http';
import { CORE_DIRECTIVES, NgSelectOption, CheckboxControlValueAccessor, FORM_DIRECTIVES,
    FormBuilder, ControlGroup, Validators, Control } from 'angular2/common';
// NgSelectOption CheckboxControlValueAccessor

import { urlEncode } from '../../utilities';

@Component({
    selector: 'EditorSlots',
    templateUrl: './dest/settings/editorSlots/editorSlots.html',
    directives: [ ]
})
export class EditorSlots {
    http: Http;
    days: string[] = ["Pon", "Uto", "Sri", "Čet", "Pet", "Sub", "Ned"];
    hours: number[] = new Array();
    daysNum: number[] = [0, 1, 2, 3, 4, 5, 6];

    today: Date = new Date();
    mondayDay: Date;

    slots: Slot[];

    slotClicked(day, hour) {
        console.log(day + ' ' + hour);

    }

    fb: FormBuilder;
    requestForm: ControlGroup;
    time: Control;
    day0: Control;
    day1: Control;
    day2: Control;
    day3: Control;
    day4: Control;
    day5: Control;
    day6: Control;
    start_date: Control;
    end_date: Control;

    requestSlot(values) {
        console.log(values);
        let days_bit_mask = '' + (values.day0 ? 1 : 0) + (values.day1 ? 1 : 0) + (values.day2 ? 1 : 0) + (values.day3 ? 1 : 0) + (values.day4 ? 1 : 0) + (values.day5 ? 1 : 0) + (values.day6 ? 1 : 0);
        console.log(days_bit_mask);
        let start_date = new Date(values.start_date);
        let start_date2 = start_date.getFullYear() + '-' + (start_date.getMonth() + 1) + '-' + start_date.getDate();
        let end_date = new Date(values.end_date);
        let end_date2 = end_date.getFullYear() + '-' + (end_date.getMonth() + 1) + '-' + end_date.getDate();
        let requestObj = {
            'time': values.time,
            'days_bit_mask': days_bit_mask,
            'start_date': start_date2,
            'end_date': end_date2
        };
        this.http.post('/editor/slots/request', urlEncode(requestObj)).map((res) => res.json().data).subscribe((res) => console.log(res), (err) => console.log(err));
    }

    constructor(http: Http, fb: FormBuilder) {
        this.http = http;
        this.fb = fb;

        this.requestForm = fb.group({
            'time': new Control('', Validators.required),
            'day0': new Control(),
            'day1': new Control(),
            'day2': new Control(),
            'day3': new Control(),
            'day4': new Control(),
            'day5': new Control(),
            'day6': new Control(),
            'start_date': new Control('', Validators.required),
            'end_date': new Control('', Validators.required)
        });

        for (let i = 9; i <= 20; ++i) {
            this.hours.push(i);
        }

        let secSinceMonday = this.today.getMilliseconds() + 1000 * (this.today.getSeconds() + 60 * (this.today.getMinutes() + 60 * (this.today.getHours() + 24 * ((this.today.getDay() + 6) % 7))));
        this.mondayDay = new Date(this.today.getTime() - secSinceMonday);
        console.log(this.mondayDay);

        http.get('/editor/slots/list').map((res) => res.json().data).subscribe((res) => {
            console.log(res);
        }, (err) => console.log(err));
    }
}

class Slot {
    id: number;
    time: Date;
    count: number;
}
