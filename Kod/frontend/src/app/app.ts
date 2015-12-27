import { Component, View, provide } from "angular2/core";

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

@Component({
    selector: 'App',
    templateUrl: './dest/App/App.html',
    directives: [ROUTER_DIRECTIVES]
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

    constructor(router: Router) {
        this.router = router;
    }
}

bootstrap(App, [ROUTER_PROVIDERS
    , provide(LocationStrategy
        , { useClass: HashLocationStrategy }
    )]);