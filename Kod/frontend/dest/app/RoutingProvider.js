var router_1 = require('angular2/router');
var accountData_1 = require('../settings/accountData/accountData');
var accountDelete_1 = require('../settings/accountDelete/accountDelete');
var accountPassword_1 = require('../settings/accountPassword/accountPassword');
var addTrack_1 = require('../settings/addTrack/addTrack');
var editUser_1 = require('../settings/editUser/editUser');
var makePlaylist_1 = require('../settings/makePlaylist/makePlaylist');
var makeWishlist_1 = require('../settings/makeWishlist/makeWishlist');
var manageAdmins_1 = require('../settings/manageAdmins/manageAdmins');
var manageEditors_1 = require('../settings/manageEditors/manageEditors');
var manageRadiostation_1 = require('../settings/manageRadiostation/manageRadiostation');
var manageTracks_1 = require('../settings/manageTracks/manageTracks');
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
            { 'Croatian': 'Upravljaj administratorima', 'componentName': 'ManageAdmins', 'componentObject': manageAdmins_1.ManageAdmins },
            { 'Croatian': 'Pregledaj podatke o postaji', 'componentName': 'ManageRadiostation', 'componentObject': manageRadiostation_1.ManageRadiostation }
        ]
    },
    {
        'Croatian': 'Administratorske modućnosti',
        'groupName': 'AdminOptions',
        'components': [
            { 'Croatian': 'Uredi zvučne zapise', 'componentName': 'ManageTracks', 'componentObject': manageTracks_1.ManageTracks },
            { 'Croatian': 'Upravljaj urednicima', 'componentName': 'ManageEditors', 'componentObject': manageEditors_1.ManageEditors },
            { 'Croatian': 'Dodaj pjesmu', 'componentName': 'AddTrack', 'componentObject': addTrack_1.AddTrack },
            { 'Croatian': 'Upravljaj korisnicima', 'componentName': 'EditUser', 'componentObject': editUser_1.EditUser },
        ]
    },
    {
        'Croatian': 'Uredničke mogućnosti',
        'groupName': 'EditorOptions',
        'components': [
            { 'Croatian': 'Pregledaj termine', 'componentName': 'MakePlaylist', 'componentObject': makePlaylist_1.MakePlaylist }
        ]
    },
    {
        'Croatian': 'Korisničke mogućnosti',
        'groupName': 'UserOptions',
        'components': [
            { 'Croatian': 'Pregledaj listu želja', 'componentName': 'MakeWishlist', 'componentObject': makeWishlist_1.MakeWishlist }
        ]
    },
    {
        'Croatian': 'Postavke računa',
        'groupName': 'AccountSettings',
        'components': [
            { 'Croatian': 'Uredi osobne podatke', 'componentName': 'AccountData', 'componentObject': accountData_1.AccountData },
            { 'Croatian': 'Promijeni lozinku', 'componentName': 'AccountPassword', 'componentObject': accountPassword_1.AccountPassword },
            { 'Croatian': 'Obriši račun', 'componentName': 'AccountDelete', 'componentObject': accountDelete_1.AccountDelete }
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