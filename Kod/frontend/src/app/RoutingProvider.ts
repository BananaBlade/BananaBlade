import { Route, RouteDefinition } from 'angular2/router';

import { AccountData } from '../settings/AccountData/AccountData';
import { AccountDelete } from '../settings/AccountDelete/AccountDelete';
import { AccountLogin } from '../settings/AccountLogin/AccountLogin';
import { AccountPassword } from '../settings/AccountPassword/AccountPassword';
import { AddTrack } from '../settings/AddTrack/AddTrack';

import { EditUser } from '../settings/EditUser/EditUser';
import { MakePlaylist } from '../settings/MakePlaylist/MakePlaylist';
import { MakeWishlist } from '../settings/MakeWishlist/MakeWishlist';
import { ManageAdmins } from '../settings/ManageAdmins/ManageAdmins';
import { ManageEditors } from '../settings/ManageEditors/ManageEditors';
import { ManageRadiostation } from '../settings/ManageRadiostation/ManageRadiostation';
import { ManageTracks } from '../settings/ManageTracks/ManageTracks';
import { ManageUsers } from '../settings/ManageUsers/ManageUsers';

let navigationArray = [
    {
        'Croatian': 'Slusaj radio',
        'groupName': 'Listen',
        'components': []
    },
    {
        'Croatian': 'Vlasničke mogućnosti',
        'groupName': 'OwnerOptions',
        'components': [
            { 'Croatian': 'Upravljaj administratorima', 'componentName': 'ManageAdmins', 'componentObject': ManageAdmins },
            { 'Croatian': 'Pregledaj podatke o postaji', 'componentName': 'ManageRadiostation', 'componentObject': ManageRadiostation }
        ]
    },
    {
        'Croatian': 'Administratorske modućnosti',
        'groupName': 'AdminOptions',
        'components': [
            { 'Croatian': 'Uredi zvučne zapise', 'componentName': 'ManageTracks', 'componentObject': ManageTracks },
            { 'Croatian': 'Upravljaj urednicima', 'componentName': 'ManageEditors', 'componentObject': ManageEditors },
            { 'Croatian': 'Dodaj pjesmu', 'componentName': 'AddTrack', 'componentObject': AddTrack },
            { 'Croatian': 'Upravljaj korisnicima', 'componentName': 'EditUser', 'componentObject': EditUser },
        ]
    },
    {
        'Croatian': 'Uredničke mogućnosti',
        'groupName': 'EditorOptions',
        'components': [
            { 'Croatian': 'Pregledaj termine', 'componentName': 'MakePlaylist', 'componentObject': MakePlaylist }
        ]
    },
    {
        'Croatian': 'Korisničke mogućnosti',
        'groupName': 'UserOptions',
        'components': [
            { 'Croatian': 'Pregledaj listu želja', 'componentName': 'MakeWishlist', 'componentObject': MakeWishlist }
        ]
    },
    {
        'Croatian': 'Postavke računa',
        'groupName': 'AccountSettings',
        'components': [
            { 'Croatian': 'Uredi osobne podatke', 'componentName': 'AccountData', 'componentObject': AccountData },
            { 'Croatian': 'Promijeni lozinku', 'componentName': 'AccountPassword', 'componentObject': AccountPassword },
            { 'Croatian': 'Obriši račun', 'componentName': 'AccountDelete', 'componentObject': AccountDelete }
            //  { 'Croatian': 'Login', 'componentName': 'Login', 'componentObject': Logi}
        ]
    }
];

export function getNavigationArray() {
    return navigationArray;
}

export function getRouteConfig() {
    let routeDefinitionArray: RouteDefinition[] = [];

    for (let i in navigationArray) {
        for (let j in navigationArray[i].components) {
            let component = navigationArray[i].components[j];
            // path name component
            let route = new Route({ 'path': component.componentName, 'name': component.componentName, 'component': component.componentObject });
            routeDefinitionArray.push(route);
        }
    }

    return routeDefinitionArray;
}