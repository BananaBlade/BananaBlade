var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('angular2/core');
var common_1 = require('angular2/common');
var MyHeader = (function () {
    function MyHeader(fb) {
        this.email = new common_1.Control('', common_1.Validators.required);
        this.password = new common_1.Control('', common_1.Validators.required);
        this.loginForm = fb.group({
            'email': this.email,
            'password': this.password
        });
        this.debug = "a";
    }
    MyHeader.prototype.onSubmit = function (value) {
        this.debug = "clicked";
    };
    MyHeader = __decorate([
        core_1.Component({
            selector: 'my-header',
            templateUrl: './dest/App/MyHeader.html',
            styles: [],
            directives: [common_1.FORM_DIRECTIVES, common_1.COMMON_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [common_1.FormBuilder])
    ], MyHeader);
    return MyHeader;
})();
exports.MyHeader = MyHeader;
//# sourceMappingURL=MyHeader.js.map