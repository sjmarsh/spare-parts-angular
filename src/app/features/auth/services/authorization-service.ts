import { Injectable } from "@angular/core";
import { Store } from '@ngrx/store';
import { AuthState } from '../store/auth.reducers';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from "@angular/router";

@Injectable({
    providedIn: 'root'
  })
export class AuthorizationService {

    private loginState?: AuthState

    constructor(private store: Store<{login: AuthState}>){
        this.store.select(state => state.login).subscribe(s => {
            this.loginState = s;
        })
    }

    userIsLoggedIn = () : boolean => {
        if(!this.loginState) {
            return false;
        }
        return this.loginState.isAuthenticated;
    }

    userHasRequiredRoles = (requiredRoles: Array<string> | null) : boolean => {
        if(!requiredRoles || requiredRoles.length === 0 || !this.loginState)
            return false;
            
        const usersRoles = this.loginState.roles;
        const intersectingRoles  = usersRoles?.filter(x => requiredRoles?.includes(x));
        return (intersectingRoles && intersectingRoles.length > 0) ? true : false;
    }        
}


