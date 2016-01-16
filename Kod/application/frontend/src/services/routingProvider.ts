import { Route, RouteDefinition } from 'angular2/router';
import { Type } from 'angular2/core';

import { Index } from '../components/index/index';

import { AccountData } from '../components/accountData/accountData';
import { AccountDelete } from '../components/accountDelete/accountDelete';
import { AccountPassword } from '../components/accountPassword/accountPassword';
import { AddTrack } from '../components/addTrack/addTrack';

import { EditUser } from '../components/editUser/editUser';
import { MakePlaylist } from '../components/makePlaylist/makePlaylist';
import { MakeWishlist } from '../components/makeWishlist/makeWishlist';
import { ManageAdmins } from '../components/manageAdmins/manageAdmins';
import { ManageEditors } from '../components/manageEditors/manageEditors';
import { ManageRadiostation } from '../components/manageRadiostation/manageRadiostation';
import { ManageTracks } from '../components/manageTracks/manageTracks';
import { ManageUsers } from '../components/manageUsers/manageUsers';

// Newly added
import { EditorSlots } from '../components/editorSlots/editorSlots';
import { ManageRequests } from '../components/manageRequests/manageRequests';
import { EditTrack } from '../components/editTrack/editTrack';

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

let navigationArray = [
    new NavGroup('Slusaj radio', [], true, new MyComponent('', 'Index', Index)),
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

export function getNavigationArray() {
    return navigationArray;
}

export function getRouteConfig() {
    let routeDefinitionArray: RouteDefinition[] = [];

    // let route = new Route({ 'path' : '/', 'name' : 'Index', 'component' : Index })
    // routeDefinitionArray.push( route )

    for (let i in navigationArray) {
        for (let j in navigationArray[i].components) {
            let component = navigationArray[i].components[j];
            routeDefinitionArray.push(component.getRoute());
        }
        if (navigationArray[i].hasLink) {
            routeDefinitionArray.push(navigationArray[i].link.getRoute());
        }
    }

    return routeDefinitionArray;
}
