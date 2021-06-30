import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../../app/_services';
import { User } from '../../app/_models';
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    currentUser: User;
    constructor(private authenticationService: AuthenticationService) {
        
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
            if (this.currentUser) {
                    request = request.clone({
                        setHeaders: { 
                            'Authorization': 'Bearer ' + this.currentUser.api_token,
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        }
            });
        }
        
        return next.handle(request);
    }
}
