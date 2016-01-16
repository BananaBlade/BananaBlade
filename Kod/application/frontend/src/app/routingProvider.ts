import { Route, RouteDefinition } from 'angular2/router';
import { Type } from 'angular2/core';

import { Index } from '../index/index';

import { AccountData } from '../settings/accountData/accountData';
import { AccountDelete } from '../settings/accountDelete/accountDelete';
import { AccountPassword } from '../settings/accountPassword/accountPassword';
import { AddTrack } from '../settings/addTrack/addTrack';

import { EditUser } from '../settings/editUser/editUser';
import { MakePlaylist } from '../settings/makePlaylist/makePlaylist';
import { MakeWishlist } from '../settings/makeWishlist/makeWishlist';
import { ManageAdmins } from '../settings/manageAdmins/manageAdmins';
import { ManageEditors } from '../settings/manageEditors/manageEditors';
import { ManageRadiostation } from '../settings/manageRadiostation/manageRadiostation';
import { ManageTracks } from '../settings/manageTracks/manageTracks';
import { ManageUsers } from '../settings/manageUsers/manageUsers';

// Newly added
import { EditorSlots } from '../settings/editorSlots/editorSlots';
import { ManageRequests } from '../settings/manageRequests/manageRequests';
import { EditTrack } from '../settings/editTrack/editTrack';

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
