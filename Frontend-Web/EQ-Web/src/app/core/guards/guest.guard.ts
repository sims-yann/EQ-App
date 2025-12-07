import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class GuestGuard {
  
  constructor(private router: Router) {}

  canActivate(): boolean {
    const logged = localStorage.getItem('auth_token');

    if (logged) {
      this.router.navigate(['/dashboard']);
      return false;
    }

    return true;
  }
}
