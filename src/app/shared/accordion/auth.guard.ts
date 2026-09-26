import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ErrorlogService } from 'src/app/errorlog.service';
import { CookieService } from 'src/app/service/cookie.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  privilegearr: any[] = [];
  currentUser: any;
  count = 0;
  constructor(private router: Router, private cookieService: CookieService,private errorlogService: ErrorlogService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    debugger;

    const parent = next.data['parent'];
    console.log('Required parent:', parent);

    // Step 1: Check if user is logged in via cookie
    const user = this.cookieService.getCookie('login');
    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    // Step 2: Get the full combined route path
    let fullRouteName = this.getFullRoutePath(next);
    console.log('Full Route Path:', fullRouteName);

    if (fullRouteName === 'login') {
      this.router.navigate(['/login']);
      return false;
    }

    // Step 3: Load privileges from local storage
    const privilegeData = localStorage.getItem('privilegearr');
    this.privilegearr = privilegeData ? JSON.parse(privilegeData) : [];
console.log("privilegearr",this.privilegearr);

    // Step 4: Check if the route has appropriate privileges 
    const routePrivilege = this.privilegearr.find(
      (privilege) =>
        privilege.status === 1 &&
        (privilege.routename === fullRouteName || privilege.routename === parent)
    );

    if (this.hasAccess(routePrivilege)) {
      return true;
    } else {
      return this.handleRoleBasedNavigation(fullRouteName);
      // alert('You are not authorized to access this page.');
      // return false;
    }
  }

  /**
   * Recursively builds the full route path from the `ActivatedRouteSnapshot`.
   */
  private getFullRoutePath(route: ActivatedRouteSnapshot): string {
    const pathSegments: string[] = [];

    let currentRoute: ActivatedRouteSnapshot | null = route;
    while (currentRoute) {
      if (currentRoute.routeConfig?.path) {
        pathSegments.unshift(currentRoute.routeConfig.path);
      }
      currentRoute = currentRoute.parent;
    }

    return pathSegments.join('/');
  }

  /**
   * Determines if the user has access to a specific route based on privileges.
   */
  private hasAccess(routePrivilege: any): boolean {
    if (!routePrivilege) {
      return this.handleRoleBasedNavigation('');
    }

    const accessTypes = [
      'cloneaccess',
      'viewaccess',
      'createaccess',
      'deleteaccess',
      'editaccess',
      'fullgrantaccess',
      'listaccess',
    ];

    return accessTypes.some((accessType) => routePrivilege[accessType] === 1);
  }

  /**
   * Handles navigation based on the user's role and current route.
   */
  private handleRoleBasedNavigation(routeName: string): boolean {
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    const role_id = this.currentUser ? JSON.parse(this.currentUser)[0]?.role_id : '';

    this.errorlogService.logManualValidationError(`auth.gaurd.ts|handleRoleBasedNavigation()|You are not authorized to access this page.`);

    Swal.fire({ toast: true, position: 'top', showConfirmButton: false, timer: 3000, title: 'You are not authorized to access this page.', icon: 'error', });


    // alert('You are not authorized to access this page.');
    if (!role_id) {
      this.router.navigate(['/login']);
      return false;
    }

    switch (role_id) {
      case 9:
        if (this.router.url !== '/gemotors-dashboard') {
          this.router.navigate(['/gemotors-dashboard']).then(() => {
            window.location.reload();
          });
        }
        return true;

      case 10:
        if (this.router.url !== '/gemotors-db') {
          this.router.navigate(['/gemotors-db']).then(() => {
            window.location.reload();
          });
        }
        return true;

      case 11:
      case 5:
        if (this.router.url !== '/customer') {
          this.router.navigate(['/customer']).then(() => {
            window.location.reload();
          });
        }
        return true;

      default:
        if (this.router.url !== '/dashboard') {
          this.router.navigate(['/dashboard']).then(() => {
            if (this.count === 0) {
              this.count++;
              window.location.reload();
            } else {
              this.router.navigate(['/login']);
            }
          });
        }


        if (this.router.url == '/dashboard') {
          this.router.navigate(['/dashboard']);
        }

        return true;
    }


  }
}
