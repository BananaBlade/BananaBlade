
import { View, Component } from 'angular2/core';
import { Location, RouteConfig, RouterLink, Router, CanActivate } from 'angular2/router';
import { COMMON_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';

import { Form, HttpAdvanced } from '../../services/services';

@Component({
    selector: 'ManageEditors',
    templateUrl: './dest/views/manageEditors/manageEditors.html',
    directives: [ COMMON_DIRECTIVES, FORM_DIRECTIVES ]
})
export class ManageEditors {
    http: HttpAdvanced;
    editors: User[] = new Array();
    closestMatches: any[] = new Array();
    editable: boolean = false;
    userSearch: string = "";

    toggleEditable() {
        this.editable = !this.editable;
    }

    onKeyPressed(event?) {
        let count = 0;
        let enteredLetter = event ? String.fromCharCode(event.keyCode) : '';

        if (this.userSearch.length < 2) return;

        this.http.get('/users/search/' + this.userSearch + enteredLetter, (res) => {
            this.closestMatches = new Array();
            for (let i = 0; i < 3 && res[i]; i += 1) {
                this.closestMatches.push(res[i]);
            }
        });
    }

    enterCheck(event) {
        if (event.keyCode == 13) {
            this.addEditor();
        }
    }

    addEditor() {
        this.http.post('/admin/editors/add/' + this.closestMatches[0].id, '');
        this.editors.push(this.closestMatches[0]);

        this.userSearch = "";
        this.closestMatches = new Array();
    }

    removeEditor(removedEditorId) {
        for (let i in this.editors) {
            if (this.editors[i].id === removedEditorId) {
                this.editors.splice(i, 1);
                break;
            }
        }
        this.http.post('/admin/editors/remove/' + removedEditorId.toString(), '');
    }

    constructor(http: HttpAdvanced) {
        this.http = http;

        http.get('/admin/editors/list', (res) => {
            this.editors = new Array();
            for (let i in res) {
                this.editors.push(new User(res[i]));
            }
        });
    }
}

class User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    year_of_birth: string;
    occupation: string;
    account_type: number;

    constructor(obj: Object) {
        this.id = obj['id'];
        this.first_name = obj['first_name'];
        this.last_name = obj['last_name'];
        this.email = obj['email'];
        this.year_of_birth = obj['year_of_birth'];
        this.occupation = obj['occupation'];
        this.account_type = obj['account_type'];
    }
}
