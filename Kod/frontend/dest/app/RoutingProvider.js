var router_1 = require('angular2/router');
var AccountData_1 = require('../settings/AccountData/AccountData');
var AccountDelete_1 = require('../settings/AccountDelete/AccountDelete');
var AccountPassword_1 = require('../settings/AccountPassword/AccountPassword');
var AddTrack_1 = require('../settings/AddTrack/AddTrack');
var EditUser_1 = require('../settings/EditUser/EditUser');
var MakePlaylist_1 = require('../settings/MakePlaylist/MakePlaylist');
var MakeWishlist_1 = require('../settings/MakeWishlist/MakeWishlist');
var ManageAdmins_1 = require('../settings/ManageAdmins/ManageAdmins');
var ManageEditors_1 = require('../settings/ManageEditors/ManageEditors');
var ManageRadiostation_1 = require('../settings/ManageRadiostation/ManageRadiostation');
var ManageTracks_1 = require('../settings/ManageTracks/ManageTracks');
var navigationArray = [
    {
        'Croatian': 'Slusaj radio',
        'groupName': 'Listen',
        'components': []
    },
    {
        'Croatian': 'Vlasničke mogućnosti',
        'groupName': 'OwnerOptions',
        'components': [
            { 'Croatian': 'Upravljaj administratorima', 'componentName': 'ManageAdmins', 'componentObject': ManageAdmins_1.ManageAdmins },
            { 'Croatian': 'Pregledaj podatke o postaji', 'componentName': 'ManageRadiostation', 'componentObject': ManageRadiostation_1.ManageRadiostation }
        ]
    },
    {
        'Croatian': 'Administratorske modućnosti',
        'groupName': 'AdminOptions',
        'components': [
            { 'Croatian': 'Uredi zvučne zapise', 'componentName': 'ManageTracks', 'componentObject': ManageTracks_1.ManageTracks },
            { 'Croatian': 'Upravljaj urednicima', 'componentName': 'ManageEditors', 'componentObject': ManageEditors_1.ManageEditors },
            { 'Croatian': 'Dodaj pjesmu', 'componentName': 'AddTrack', 'componentObject': AddTrack_1.AddTrack },
            { 'Croatian': 'Upravljaj korisnicima', 'componentName': 'EditUser', 'componentObject': EditUser_1.EditUser },
        ]
    },
    {
        'Croatian': 'Uredničke mogućnosti',
        'groupName': 'EditorOptions',
        'components': [
            { 'Croatian': 'Pregledaj termine', 'componentName': 'MakePlaylist', 'componentObject': MakePlaylist_1.MakePlaylist }
        ]
    },
    {
        'Croatian': 'Korisničke mogućnosti',
        'groupName': 'UserOptions',
        'components': [
            { 'Croatian': 'Pregledaj listu želja', 'componentName': 'MakeWishlist', 'componentObject': MakeWishlist_1.MakeWishlist }
        ]
    },
    {
        'Croatian': 'Postavke računa',
        'groupName': 'AccountSettings',
        'components': [
            { 'Croatian': 'Uredi osobne podatke', 'componentName': 'AccountData', 'componentObject': AccountData_1.AccountData },
            { 'Croatian': 'Promijeni lozinku', 'componentName': 'AccountPassword', 'componentObject': AccountPassword_1.AccountPassword },
            { 'Croatian': 'Obriši račun', 'componentName': 'AccountDelete', 'componentObject': AccountDelete_1.AccountDelete }
        ]
    }
];
function getNavigationArray() {
    return navigationArray;
}
exports.getNavigationArray = getNavigationArray;
function getRouteConfig() {
    var routeDefinitionArray = [];
    for (var i in navigationArray) {
        for (var j in navigationArray[i].components) {
            var component = navigationArray[i].components[j];
            var route = new router_1.Route({ 'path': component.componentName, 'name': component.componentName, 'component': component.componentObject });
            routeDefinitionArray.push(route);
        }
    }
    return routeDefinitionArray;
}
exports.getRouteConfig = getRouteConfig;
//# sourceMappingURL=RoutingProvider.js.map