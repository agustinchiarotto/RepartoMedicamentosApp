import { Injectable, Inject } from '@angular/core';
import { WINDOW } from './window.provider';

@Injectable()
export class UrlService {

    constructor(@Inject(WINDOW) private window: Window) {
    }

    getRestApiUrl(): string {
        return this.window.location.protocol + '//' + this.window.location.hostname + ':4000';
    }
}
