import { Injectable } from '@angular/core';
import { decode } from 'jwt-simple';
import { secretKey } from '../../../config/secret';

@Injectable()
export class TokenService {
    private token: string;

    constructor() {
        this.token = localStorage.getItem('token');
    }

    public tokenExists(): boolean {
        return this.token !== null;
    }

    public getToken(): string {
        return this.token;
    }

    public setToken(token): void {
        localStorage.setItem('token', token);
        this.token = localStorage.getItem('token');
    }

    public deleteToken(): void {
        this.token = null;
        localStorage.removeItem('token');
    }

    public decodeToken(): Object {
        return decode(this.token, secretKey).user;
    }

    public getUsername(): string {
        return this.decodeToken()['profile'].username;
    }
}
