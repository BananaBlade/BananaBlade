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
var http_1 = require('angular2/http');
var UrlEncoder_1 = require('../../App/UrlEncoder');
var ManageRadiostation = (function () {
    function ManageRadiostation(fb, http) {
        var _this = this;
        this.http = http;
        this.name = new common_1.Control('lala', common_1.Validators.required);
        this.description = new common_1.Control('', common_1.Validators.required);
        this.oib = new common_1.Control('', common_1.Validators.required);
        this.address = new common_1.Control('', common_1.Validators.required);
        this.email = new common_1.Control('', common_1.Validators.required);
        this.frequency = new common_1.Control('', common_1.Validators.required);
        this.isFormDisabled = true;
        this.myForm = fb.group({
            'name': this.name,
            'description': this.description,
            'oib': this.oib,
            'address': this.address,
            'email': this.email,
            'frequency': this.frequency
        });
        this.http.get('http://localhost:5000/station/get').map(function (text) { return text.json(); }).subscribe(function (response) {
            var stationObj = response.data;
            console.log(stationObj);
            _this.nameModel = stationObj.name;
            _this.descriptionModel = stationObj.description;
            _this.oibModel = stationObj.oib;
            _this.addressModel = stationObj.address;
            _this.emailModel = stationObj.email;
            _this.frequencyModel = stationObj.frequency;
        });
    }
    ManageRadiostation.prototype.onSubmit = function (value) {
        this.http.post('http://localhost:5000/owner/station/modify', UrlEncoder_1.urlEncode({
            'name': this.nameModel,
            'description': this.descriptionModel,
            'oib': this.oibModel,
            'address': this.addressModel,
            'email': this.emailModel,
            'frequency': this.frequencyModel
        })).map(function (resp) { return resp.text(); }).subscribe(function (resp) { return console.log(resp); });
    };
    ManageRadiostation = __decorate([
        core_1.Component({
            selector: 'ManageRadiostation',
            templateUrl: './dest/Settings/ManageRadiostation/ManageRadiostation.html',
            directives: [common_1.CORE_DIRECTIVES, common_1.FORM_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [common_1.FormBuilder, http_1.Http])
    ], ManageRadiostation);
    return ManageRadiostation;
})();
exports.ManageRadiostation = ManageRadiostation;
//# sourceMappingURL=ManageRadiostation.js.map