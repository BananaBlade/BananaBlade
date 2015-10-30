/// <reference path="./typedef/angular2/angular2.d.ts"/>
System.register(['./typedef/angular2/angular2.d.ts'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
        switch (arguments.length) {
            case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
            case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
            case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
        }
    };
    var angular2_d_ts_1;
    var AppComponent, Hero, HEROES;
    return {
        setters:[
            function (angular2_d_ts_1_1) {
                angular2_d_ts_1 = angular2_d_ts_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent() {
                    this.title = "Tour of Heroes";
                    this.heroes = HEROES;
                }
                AppComponent.prototype.onSelect = function (hero) { this.selectedHero = hero; };
                AppComponent.prototype.getSelectedClass = function (hero) {
                    return { 'selected': hero === this.selectedHero };
                };
                AppComponent = __decorate([
                    angular2_d_ts_1.Component({
                        selector: 'my-app',
                        styles: ["\n    "],
                        template: "\n      <h1>{{title}}</h1>\n      <h2>My Heroes</h2>\n      <ul class=\"heroes\">\n        <li *ng-for=\"#hero of heroes\"\n          (click)=\"onSelect(hero)\"\n          [ng-class]=\"getSelectedClass(hero)\"\n          >\n            <a><span class=\"badge\">{{hero.id}}</span> {{hero.name}}</a>\n        </li>\n      </ul>\n      <div *ng-if=\"selectedHero\">\n        <h2>{{selectedHero.name}} details!</h2>\n        <div><label>id: </label>{{selectedHero.id}}</div>\n        <div>\n            <label>namee: </label>\n            <input [(ng-model)]=\"selectedHero.name\" placeholder=\"name\"></input>\n        </div>\n      </div>\n      ",
                        directives: [angular2_d_ts_1.FORM_DIRECTIVES, angular2_d_ts_1.FORM_DIRECTIVES]
                    })
                ], AppComponent);
                return AppComponent;
            })();
            Hero = (function () {
                function Hero() {
                }
                return Hero;
            })();
            HEROES = [
                { "id": 11, "name": "Mr. Nice" },
                { "id": 12, "name": "Narco" },
                { "id": 13, "name": "Bombasto" },
                { "id": 14, "name": "Celeritas" },
                { "id": 15, "name": "Magneta" },
                { "id": 16, "name": "RubberMan" },
                { "id": 17, "name": "Dynama" },
                { "id": 18, "name": "Dr IQ" },
                { "id": 19, "name": "Magma" },
                { "id": 20, "name": "Tornado" }
            ];
            angular2_d_ts_1.bootstrap(AppComponent);
        }
    }
});
