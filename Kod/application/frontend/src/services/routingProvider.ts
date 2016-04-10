import { AsyncRoute, RouteDefinition } from 'angular2/router';
import { Type } from 'angular2/core';

declare var System: any;
var VIEWS_DIR_PATH: string = '../dist/views/';

class ComponentHelper {
    static LoadComponentAsync( name, path ) {
        return System.import( path ).then( c => c[ name ] );
    }
}

class MyAsyncComponent {
    displayName: string;
    componentName: string;
    folderName : string;
    routePath: string;
    object: Type;
    hidden: boolean;

    constructor( displayName: string, componentName: string, folderName: string, routePath: string, hidden? : boolean ) {
        this.displayName = displayName;
        this.componentName = componentName;
        this.folderName = folderName;
        this.routePath = routePath;
        this.hidden = hidden ? true : false;
    }

    getLoader() {
        return () => ComponentHelper.LoadComponentAsync( this.componentName, VIEWS_DIR_PATH + this.folderName + '/' + this.folderName );
    }

    getRoute() {
        return new AsyncRoute({ 'path': this.routePath, 'name': this.componentName, 'loader': this.getLoader() });
    }
}

class NavGroup {
    displayName: string;
    components: MyAsyncComponent[];
    accountType: number;
    hasLink: boolean;
    link: MyAsyncComponent;

    constructor( displayName: string, components: MyAsyncComponent[], accountType: number, hasLink: boolean, link?: MyAsyncComponent ) {
        this.displayName = displayName;
        this.components = components;
        this.accountType = accountType;
        this.hasLink = hasLink;
        this.link = link ? link : null;
    }
}

export class NavigationProvider {
    static navigationArray: NavGroup[] = [
        new NavGroup( 'Slušaj radio', [], 2 + 4 + 8 + 16, true, new MyAsyncComponent('', 'Index', 'index', '/')),
        new NavGroup( 'Pregled mogućnosti', [], 2+4+8+16, true, new MyAsyncComponent( '', 'Overview', 'overview', './' ) ),
        new NavGroup( 'Vlasničke mogućnosti', [
            new MyAsyncComponent( 'Administratori', 'ManageAdmins', 'manageAdmins', './admins' ),
            new MyAsyncComponent( 'Podaci o postaji', 'ManageRadiostation', 'manageRadiostation', './station' ),
        ], 16, false ),
        new NavGroup( 'Administratorske mogućnosti', [
            new MyAsyncComponent( 'Zvučni zapisi', 'ManageTracks', 'manageTracks', './tracks' ),
            new MyAsyncComponent( 'Urednici', 'ManageEditors', 'manageEditors', './editors' ),
            new MyAsyncComponent( 'Zahtjevi za terminima', 'ManageRequests', 'manageRequests', './requests' ),
            new MyAsyncComponent( 'Korisnici', 'ManageUsers', 'manageUsers', './users' ),
            new MyAsyncComponent( 'Uredi korisnika', 'EditUser', 'editUser', './users/edit', true ),
            new MyAsyncComponent( 'Dodaj zvučni zapis', 'AddTrack', 'addTrack', './tracks/add', true ),
            new MyAsyncComponent( 'Uredi zvučni zapis', 'EditTrack', 'editTrack', './tracks/edit', true ),
            new MyAsyncComponent( 'Statistike', 'ShowStats', 'showStats', './stats' )
        ], 8, false ),
        new NavGroup( 'Uredničke mogućnosti', [
            new MyAsyncComponent( 'Termini reprodukcije', 'EditorSlots', 'editorSlots', './slots' ),
            new MyAsyncComponent( 'Sastavi listu za reprodukciju', 'MakePlaylist', 'makePlaylist', './slots/playlist', true )
        ], 4, false ),
        new NavGroup( 'Korisničke mogućnosti', [
            new MyAsyncComponent( 'Lista želja', 'MakeWishlist', 'makeWishlist', './wishlist' ),
        ], 2, false ),
        new NavGroup( 'Postavke računa', [
            new MyAsyncComponent( 'Osobni podaci', 'AccountData', 'accountData', './account' ),
            new MyAsyncComponent( 'Promjena lozinke', 'AccountPassword', 'accountPassword', './account/password' ),
            new MyAsyncComponent( 'Brisanje računa', 'AccountDelete', 'accountDelete', './account/delete' )
        ], 2+4+8+16, false )
    ];

    static getNavigationArray() {
        if (this.navigationArray[ 2 ].components.length < 3)
            this.navigationArray[ 2 ].components.push( new MyAsyncComponent( 'Statistike', 'ShowStats', 'showStats', './stats' ) );
        return this.navigationArray;
    }

    static getRouteConfig(dataObj? : any) {
        let routeDefinitionArray: RouteDefinition[] = [];

        for ( let i in this.navigationArray ){
            for ( let j in this.navigationArray[i].components ){
                let component = this.navigationArray[ i ].components[ j ];
                routeDefinitionArray.push( component.getRoute() );
            }
            if ( this.navigationArray[ i ].hasLink ) {
                if (this.navigationArray[i].link.componentName == "Index") continue;
                else routeDefinitionArray.push( this.navigationArray[ i ].link.getRoute() );
            }
        }
        if (dataObj) {
            for (let i in routeDefinitionArray) {
                routeDefinitionArray[i].data = dataObj;
            }
        }

        routeDefinitionArray[0].useAsDefault = true;
        return routeDefinitionArray;
    }
}
