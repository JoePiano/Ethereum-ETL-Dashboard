import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {UserService} from "../services/user.service";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: 'root' 
})

export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // check if user is logged in
    if(this.authService.isLogged()) {
      // user logged in, so we get his data first
      const currentUser = this.userService.getCurrentUser();
      if (currentUser) {
        // check if route is restricted by role
        if (route.data.roles && route.data.roles.indexOf(currentUser.role.toUpperCase()) === -1) {
          // role not authorized so redirect to home page
          this.router.navigate(['/']);
          return false;
        }
        // authorized so return true
        return true;
      }
    }
    // not logged in so redirect to login page with the return url
    this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url }});
    return false;
  }
}
  
