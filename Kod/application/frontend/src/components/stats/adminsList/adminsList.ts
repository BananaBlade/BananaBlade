import { Component } from 'angular2/core';
import { COMMON_DIRECTIVES } from 'angular2/common';

import { HttpAdvanced } from '../../../services/services';

@Component({
    selector : 'admins-list',
    templateUrl : './dist/components/stats/adminsList/adminsList.html',
    directives : [ COMMON_DIRECTIVES ]
})
export class AdminsList{
    http: HttpAdvanced;
    admins : string[] = [];

    constructor(http: HttpAdvanced) {
        this.http = http;
        this.http.getNoError('/stats/active_admins/list', (res) => this.admins = res);
    }
}
