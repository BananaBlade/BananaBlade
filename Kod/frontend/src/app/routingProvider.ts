import { Route, RouteDefinition } from 'angular2/router';

import { AccountData } from '../settings/accountData/accountData';
import { AccountDelete } from '../settings/accountDelete/accountDelete';
import { AccountLogin } from '../settings/accountLogin/accountLogin';
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
