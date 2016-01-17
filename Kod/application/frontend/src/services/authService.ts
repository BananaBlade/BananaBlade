import { Injectable, Injector } from 'angular2/core';
import { Http, HTTP_PROVIDERS } from 'angular2/http';

let ACCOUNT_TYPE: string = "accountType";


@Injectable()
export class AuthService {
    private http: Http;

    storeUserAuthentication(callback?: Function) {
        this.http.get('/user/account/type2').map((res) => res.json()).subscribe((res) => {
            console.log(res);
            sessionStorage.setItem(ACCOUNT_TYPE, res.data.account_type);
            if (callback) callback();
        }, (err) => console.log(err));
    }

    isInitialized() {
        return sessionStorage.getItem(ACCOUNT_TYPE) !== null;
    }

    private getAuthLevel() {
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
        return (next, prev) => Injector.resolveAndCreate([AuthService, HTTP_PROVIDERS]).get(AuthService).isUser();
    }
    static isEditorInjector() {
        return (next, prev) => Injector.resolveAndCreate([AuthService, HTTP_PROVIDERS]).get(AuthService).isEditor();
    }
    static isAdminInjector() {
        return (next, prev) => Injector.resolveAndCreate([AuthService, HTTP_PROVIDERS]).get(AuthService).isAdmin();
    }
    static isOwnerInjector() {
        return (next, prev) => Injector.resolveAndCreate([AuthService, HTTP_PROVIDERS]).get(AuthService).isOwner();
    }


    constructor(http: Http) {
        this.http = http;
        this.storeUserAuthentication();
    }
}