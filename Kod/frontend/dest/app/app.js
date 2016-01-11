var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("angular2/core");
var common_1 = require("angular2/common");
var router_1 = require('angular2/router');
var headerBar_1 = require('../app/headerBar');
var routingProvider_1 = require('../app/routingProvider');
var App = (function () {
    function App(router) {
        this.router = router;
        this.navigation = routingProvider_1.getNavigationArray();
        for (var i = 0; i < this.navigation.length; ++i) {
            this.navigation[i].visible = true;
        }
    }
    App.prototype.hideGroup = function (group) {
        group.visible = !group.visible;
    };
    ;
    App = __decorate([
        core_1.Component({
            selector: 'App',
            templateUrl: '/cdn/dest/app/app.html',
            styles: [],
            directives: [router_1.ROUTER_DIRECTIVES, common_1.COMMON_DIRECTIVES, headerBar_1.HeaderBar]
        }),
        router_1.RouteConfig(routingProvider_1.getRouteConfig()), 
        __metadata('design:paramtypes', [router_1.Router])
    ], App);
    return App;
})();
exports.App = App;
//# sourceMappingURL=app.js.map