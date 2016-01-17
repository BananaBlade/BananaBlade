import { Route, RouteDefinition } from 'angular2/router';
import { Type } from 'angular2/core';

import { Index } from '../views/index/index';

import { AccountData } from '../views/accountData/accountData';
import { AccountDelete } from '../views/accountDelete/accountDelete';
import { AccountPassword } from '../views/accountPassword/accountPassword';
import { AddTrack } from '../views/addTrack/addTrack';

import { EditUser } from '../views/editUser/editUser';
import { MakePlaylist } from '../views/makePlaylist/makePlaylist';
import { MakeWishlist } from '../views/makeWishlist/makeWishlist';
import { ManageAdmins } from '../views/manageAdmins/manageAdmins';
import { ManageEditors } from '../views/manageEditors/manageEditors';
import { ManageRadiostation } from '../views/manageRadiostation/manageRadiostation';
import { ManageTracks } from '../views/manageTracks/manageTracks';
import { ManageUsers } from '../views/manageUsers/manageUsers';

// Newly added
import { EditorSlots } from '../views/editorSlots/editorSlots';
import { ManageRequests } from '../views/manageRequests/manageRequests';
import { EditTrack } from '../views/editTrack/editTrack';

class MyComponent {
    Croatian: string;
    name: string;
    object: Type;
    hidden: boolean;

    constructor(Croatian: string, name: string, object: Type, hidden?: boolean) {
        this.Croatian = Croatian;
        this.name = name;
        this.object = object;
        this.hidden = hidden ? true : false;
    }

    getRoute() {
        return new Route({ 'path': this.name, 'name': this.name, 'component': this.object });
    }
}

class NavGroup {
    Croatian: string;
    components: MyComponent[];
    hasLink: boolean;
    link: MyComponent;

    constructor(Croatian: string, components: MyComponent[], hasLink: boolean, link?: MyComponent) {
        this.Croatian = Croatian;
        this.components = components;
        this.hasLink = hasLink;
        this.link = link ? link : null;
    }
}

export class NavigationProvider {
    static navigationArray: NavGroup[] = [
        new NavGroup('Slušaj radio', [], true, new MyComponent('', 'Index', Index)),
        new NavGroup('Vlasničke mogućnosti', [
            new MyComponent('Upravljaj administratorima', 'ManageAdmins', ManageAdmins),
            new MyComponent('Podaci o postaji', 'ManageRadiostation', ManageRadiostation)
        ], false),
        new NavGroup('Administratorske mogućnosti', [
            new MyComponent('Uredi zvučne zapise', 'ManageTracks', ManageTracks),
            new MyComponent('Upravljaj urednicima', 'ManageEditors', ManageEditors),
            new MyComponent('Dodaj pjesmu', 'AddTrack', AddTrack),
            new MyComponent('Upravljaj korisnicima', 'ManageUsers', ManageUsers),
            new MyComponent('Ažuriraj zahtjeve', 'ManageRequests', ManageRequests),
            new MyComponent('Ažuriraj pjesmu', 'EditTrack', EditTrack)
        ], false),
        new NavGroup('Uredničke mogućnosti', [
            new MyComponent('Termini reprodukcije', 'EditorSlots', EditorSlots),
            new MyComponent('Pregledaj termine', 'MakePlaylist', MakePlaylist, true)
        ], false),
        new NavGroup('Korisničke mogućnosti', [
            new MyComponent('Pregledaj listu želja', 'MakeWishlist', MakeWishlist),
        ], false),
        new NavGroup('Postavke računa', [
            new MyComponent('Uredi osobne podatke', 'AccountData', AccountData),
            new MyComponent('Promijeni lozinku', 'AccountPassword', AccountPassword),
            new MyComponent('Obriši račun', 'AccountDelete', AccountDelete)], false)
    ];

    static getNavigationArray() {
        console.log(this.navigationArray);
        return this.navigationArray;
    }

    static getRouteConfig() {
        let routeDefinitionArray: RouteDefinition[] = [];

        // let route = new Route({ 'path' : '/', 'name' : 'Index', 'component' : Index })
        // routeDefinitionArray.push( route )

        for (let i in this.navigationArray) {
            for (let j in this.navigationArray[i].components) {
                let component = this.navigationArray[i].components[j];
                routeDefinitionArray.push(component.getRoute());
            }
            if (this.navigationArray[i].hasLink) {
                routeDefinitionArray.push(this.navigationArray[i].link.getRoute());
            }
        }

        return routeDefinitionArray;
    }
}