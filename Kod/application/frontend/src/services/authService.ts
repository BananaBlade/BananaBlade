import { Injectable } from 'angular2/core';
import { Http } from 'angular2/http';

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
        this.getAuthLevel() == '1';
    }

    isEditor() {
        this.getAuthLevel() == '2';
    }

    isAdmin() {
        this.getAuthLevel() == '3';
    }

    isOwner() {
        this.getAuthLevel() == '4';
    }


    constructor(http: Http) {
        this.http = http;
        this.storeUserAuthentication();
    }
}