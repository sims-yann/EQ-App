import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class Register {

  name = "";
  email = "";
  password = "";
  confirm = "";

  constructor(private router: Router) {}

  register() {
    if (this.password !== this.confirm) {
      alert("Passwords do not match.");
      return;
    }

    // save fake token
    localStorage.setItem('auth_token', 'true');
    this.router.navigate(['/dashboard']);
  }
}
