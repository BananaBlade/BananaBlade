import { AsyncRoute, RouteDefinition } from 'angular2/router';
import { Type } from 'angular2/core';

// import { Index } from '../views/index/index';

// import { AccountData } from '../views/accountData/accountData';
// import { AccountDelete } from '../views/accountDelete/accountDelete';
// import { AccountPassword } from '../views/accountPassword/accountPassword';
// import { AddTrack } from '../views/addTrack/addTrack';

// import { EditUser } from '../views/editUser/editUser';
// import { MakePlaylist } from '../views/makePlaylist/makePlaylist';
// import { MakeWishlist } from '../views/makeWishlist/makeWishlist';
// import { ManageAdmins } from '../views/manageAdmins/manageAdmins';
// import { ManageEditors } from '../views/manageEditors/manageEditors';
// import { ManageRadiostation } from '../views/manageRadiostation/manageRadiostation';
// import { ManageTracks } from '../views/manageTracks/manageTracks';
// import { ManageUsers } from '../views/manageUsers/manageUsers';

// // Newly added
// import { EditorSlots } from '../views/editorSlots/editorSlots';
// import { ManageRequests } from '../views/manageRequests/manageRequests';
// import { EditTrack } from '../views/editTrack/editTrack';

declare var System: any;
var VIEWS_DIR_PATH: string = '../dest/views/';

class ComponentHelper {
    static LoadComponentAsync(name, path) {
        return System.import(path).then(c => c[name]);
    }
}

class MyAsyncComponent {
    Croatian: string;
    name: string;
    object: Type;
    hidden: boolean;

    constructor(Croatian: string, name: string, hidden?: boolean) {
        this.Croatian = Croatian;
        this.name = name;
        this.hidden = hidden ? true : false;
    }

    getLoader(): Function {
        return () => ComponentHelper.LoadComponentAsync(this.name, VIEWS_DIR_PATH + this.name + '/' + this.name);
    }

    getRoute() {
        return new AsyncRoute({ 'path': this.name, 'name': this.name, 'loader': this.getLoader() });
    }
}

class NavGroup {
    Croatian: string;
    components: MyAsyncComponent[];
    hasLink: boolean;
    link: MyAsyncComponent;

    constructor(Croatian: string, components: MyAsyncComponent[], hasLink: boolean, link?: MyAsyncComponent) {
        this.Croatian = Croatian;
        this.components = components;
        this.hasLink = hasLink;
        this.link = link ? link : null;
    }
}

export class NavigationProvider {
    static navigationArray: NavGroup[] = [
        new NavGroup('Slušaj radio', [], true, new MyAsyncComponent('', 'Index')),
        new NavGroup('Vlasničke mogućnosti', [
            new MyAsyncComponent('Upravljaj administratorima', 'ManageAdmins'),
            new MyAsyncComponent('Podaci o postaji', 'ManageRadiostation')
        ], false),
        new NavGroup('Administratorske mogućnosti', [
            new MyAsyncComponent('Uredi zvučne zapise', 'ManageTracks'),
            new MyAsyncComponent('Upravljaj urednicima', 'ManageEditors'),
            new MyAsyncComponent('Dodaj pjesmu', 'AddTrack'),
            new MyAsyncComponent('Upravljaj korisnicima', 'ManageUsers'),
            new MyAsyncComponent('Ažuriraj zahtjeve', 'ManageRequests'),
            new MyAsyncComponent('Ažuriraj pjesmu', 'EditTrack')
        ], false),
        new NavGroup('Uredničke mogućnosti', [
            new MyAsyncComponent('Termini reprodukcije', 'EditorSlots'),
            new MyAsyncComponent('Pregledaj termine', 'MakePlaylist', true)
        ], false),
        new NavGroup('Korisničke mogućnosti', [
            new MyAsyncComponent('Pregledaj listu želja', 'MakeWishlist'),
        ], false),
        new NavGroup('Postavke računa', [
            new MyAsyncComponent('Uredi osobne podatke', 'AccountData'),
            new MyAsyncComponent('Promijeni lozinku', 'AccountPassword'),
            new MyAsyncComponent('Obriši račun', 'AccountDelete')], false)
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