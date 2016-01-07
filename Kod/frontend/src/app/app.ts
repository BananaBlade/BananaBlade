import { Component, View, provide } from "angular2/core";
import { COMMON_DIRECTIVES } from "angular2/common";

import { RouteConfig, RouterLink, RouterOutlet, Route, ROUTER_DIRECTIVES, ROUTER_PROVIDERS
, Location, LocationStrategy, HashLocationStrategy, Router
} from 'angular2/router';

import { bootstrap } from 'angular2/platform/browser';

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

var components = ['AccountData', 'AccountDelete', 'AccountLogin'
    , 'AccountPassword', 'AddTrack', 'EditUser', 'MakePlaylist'
    , 'MakeWishlist', 'ManageAdmins', 'ManageEditors', 'ManageRadiostation'
    , 'ManageTracks', 'ManageUsers'];

//var routes = components.map((componentName) => { return new Route(componentName, componentName, componentName) });

@Component({
  selector: 'App',
  templateUrl: './dest/App/App.html',
  directives: [ ROUTER_DIRECTIVES, COMMON_DIRECTIVES ]
})
@RouteConfig([
  { path: '/', redirectTo: ['AccountData']},
  { path: 'AccountData', name: 'AccountData', component: AccountData },
  { path: 'AccountDelete', name: 'AccountDelete', component: AccountDelete },
  { path: 'AccountLogin', name: 'AccountLogin', component: AccountLogin },
  { path: 'AccountPassword', name: 'AccountPassword', component: AccountPassword },
  { path: 'AddTrack', name: 'AddTrack', component: AddTrack },

  { path: 'EditUser', name: 'EditUser', component: EditUser },
  { path: 'MakePlaylist', name: 'MakePlaylist', component: MakePlaylist },
  { path: 'MakeWishlist', name: 'MakeWishlist', component: MakeWishlist },
  { path: 'ManageAdmins', name: 'ManageAdmins', component: ManageAdmins },
  { path: 'ManageEditors', name: 'ManageEditors', component: ManageEditors },
  { path: 'ManageRadiostation', name: 'ManageRadiostation', component: ManageRadiostation },
  { path: 'ManageTracks', name: 'ManageTracks', component: ManageTracks },
  { path: 'ManageUsers', name: 'ManageUsers', component: ManageUsers }
])

export class App {
  router: Router;
  location: Location;
  navigation: Object;

  constructor(router: Router) {
    this.router = router;

    this.navigation = [
        {
            'Croatian': 'Slusaj radio',
            'components': []
        },
        {
            'Croatian': 'Pregled mogućnosti',
            'components': []
        },
        {
            'Croatian': 'Vlasničke mogućnosti',
            'components': [
                { 'Croatian': 'Upravljaj administratorima', 'componentName': 'ManageAdmins', 'componentObject': ManageAdmins },
                { 'Croatian': 'Pregledaj podatke o postaji', 'componentName': 'ManageRadiostation', 'componentObject': ManageRadiostation }
            ]
        },
        {
            'Croatian': 'Administratorske modućnosti',
            'components': [
                { 'Croatian': 'Uredi zvučne zapise', 'componentName': 'ManageTracks', 'componentObject': ManageTracks },
                { 'Croatian': 'Upravljaj urednicima', 'componentName': 'ManageEditors', 'componentObject': ManageEditors },
                { 'Croatian': 'Dodaj pjesmu', 'componentName': 'AddTrack', 'componentObject': AddTrack },
                { 'Croatian': 'Upravljaj korisnicima', 'componentName': 'EditUser', 'componentObject': EditUser },
            ]
        },
        {
            'Croatian': 'Uredničke mogućnosti',
            'components': [
                { 'Croatian': 'Pregledaj termine', 'componentName': 'MakePlaylist', 'componentObject': MakePlaylist }
            ]
        },
        {
            'Croatian': 'Korisničke mogućnosti',
            'components': [
                { 'Croatian': 'Pregledaj listu želja', 'componentName': 'MakeWishlist', 'componentObject': MakeWishlist }
            ]
        },
        {
            'Croatian': 'Postavke računa',
            'components': [
                { 'Croatian': 'Uredi osobne podatke', 'componentName': 'AccountData', 'componentObject': AccountData },
                { 'Croatian': 'Promijeni lozinku', 'componentName': 'AccountPassword', 'componentObject': AccountPassword },
                { 'Croatian': 'Obriši račun', 'componentName': 'AccountDelete', 'componentObject': AccountDelete }
              //  { 'Croatian': 'Login', 'componentName': 'Login', 'componentObject': Logi}
            ]
        }
    ];
  };
}

bootstrap(App, [ROUTER_PROVIDERS
    , provide(LocationStrategy
      , { useClass: HashLocationStrategy }
)]);