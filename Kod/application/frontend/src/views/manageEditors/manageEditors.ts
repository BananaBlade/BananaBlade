
import { View, Component } from 'angular2/core';
import { Location, RouteConfig, RouterLink, Router, CanActivate } from 'angular2/router';
import { Http } from 'angular2/http';
import { NgSwitchWhen, NgSwitch, NgSwitchDefault, NgIf, NgFor, FORM_DIRECTIVES} from 'angular2/common';

import { Form } from '../../services/utilities';

@Component({
    selector: 'ManageEditors',
    templateUrl: './dest/views/manageEditors/manageEditors.html',
    directives: [NgSwitchWhen, NgSwitch, NgSwitchDefault, NgIf, NgFor, FORM_DIRECTIVES]
})
export class ManageEditors {
    http: Http;
    editors: User[] = new Array();
    normalUsers: any[] = new Array();
    closestMatches: any[] = new Array();
    editable: boolean = false;
    userSearch: string = "";

    matching: boolean = false;
    matchingId: number = -1;
    matchingIndex: number = -1;

    toggleEditable() {
        this.editable = !this.editable;
    }

    checkIfMatching(searchString) {
        for (let i in this.normalUsers) {
            let fullName = this.normalUsers[i].first_name + ' ' + this.normalUsers[i].last_name;
            if (fullName === searchString) {
                this.matching = true;
                this.matchingId = this.normalUsers[i].id;
                this.matchingIndex = i;
                return;
            }
        }
        this.matching = false;
        return;
    }

    onKeyPressed(event) {
        let count = 0;
        let enteredLetter = String.fromCharCode(event.keyCode);
        this.closestMatches = new Array();
        for (let i in this.normalUsers) {
            if (count === 3) return;
            let fullName = this.normalUsers[i].first_name + ' ' + this.normalUsers[i].last_name;
            if (fullName.indexOf(this.userSearch + enteredLetter) === 0) {
                count += 1;
                this.closestMatches.push(this.normalUsers[i]);
            }
        }
        this.checkIfMatching(this.userSearch + enteredLetter);
    }

    addEditor() {
        if (this.matching) {
            this.userSearch = "";
            this.matching = false;
            this.closestMatches = new Array();

            this.editors.push(this.normalUsers[this.matchingIndex]);
            this.normalUsers.splice(this.matchingIndex, 1);

            this.http.post('/admin/editors/add/' + this.matchingId.toString(), '').map((res) => res.json()).subscribe((data) => console.log(data), (err) => console.log(err));
        }
    }

    removeEditor(removedEditorId) {
        for (let i in this.editors) {
            if (this.editors[i].id === removedEditorId) {
                this.normalUsers.push(this.editors[i]);
                this.editors.splice(i, 1);
                break;
            }
        }
        this.http.post('/admin/editors/remove/' + removedEditorId.toString(), '').map((res) => res.json()).subscribe((data) => console.log(data), (err) => console.log(err));
    }

    constructor(http: Http) {
        this.http = http;

        http.get('/admin/users/list').map((res) => res.json().data).subscribe((res) => {
            this.normalUsers = new Array();
            this.editors = new Array();
            for (let i in res) {
                let user = new User(res[i]);
                if (user.account_type === 2) this.editors.push(user);
                else if (user.account_type === 1) this.normalUsers.push(user);
                else console.log(user);
            }
        }, (err) => console.log(err));
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