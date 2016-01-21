import { Injectable, Injector, Inject, provide } from 'angular2/core';

import { HttpAdvanced } from './../services/services';

let ACCOUNT_TYPE: string = "accountType";

@Injectable()
export class AuthService {
    private http: HttpAdvanced;

    constructor(@Inject(HttpAdvanced) http: HttpAdvanced) {
        this.http = http;
        this.storeUserAuthentication();
    }

    storeUserAuthentication(callback?: Function) {
        this.http.get('/user/account/type', (res) => {
            console.log(res);
            console.log(1);
            sessionStorage.setItem(ACCOUNT_TYPE, res.account_type);
            if (callback) callback();
        });
    }

    isInitialized() {
        return !!sessionStorage.getItem(ACCOUNT_TYPE);
    }

    getAuthLevel() {
        if (!this.isInitialized()) this.storeUserAuthentication();
        return sessionStorage.getItem(ACCOUNT_TYPE);
    }

    isLoggedIn() {
        return this.isUser() || this.isEditor() || this.isAdmin() || this.isOwner();
    }

    isUser() {
        return this.getAuthLevel() == '1';
    }

    isEditor() {
        return this.getAuthLevel() == '2';
    }

    isAdmin() {
        return this.getAuthLevel() == '3';
    }

    isOwner() {
        return this.getAuthLevel() == '4';
    }

    static isUserInjector() {
        return (next, prev) => Injector.resolveAndCreate([AuthService, provide(HttpAdvanced, { useClass: HttpAdvanced })]).get(AuthService).isUser();
    }
    static isEditorInjector() {
        return (next, prev) => Injector.resolveAndCreate([AuthService, provide(HttpAdvanced, { useClass: HttpAdvanced })]).get(AuthService).isEditor();
    }
    static isAdminInjector() {
        return (next, prev) => Injector.resolveAndCreate([AuthService, provide(HttpAdvanced, { useClass: HttpAdvanced })]).get(AuthService).isAdmin();
    }
    static isOwnerInjector() {
        return (next, prev) => Injector.resolveAndCreate([AuthService, provide(HttpAdvanced, { useClass: HttpAdvanced })]).get(AuthService).isOwner();
    }
}