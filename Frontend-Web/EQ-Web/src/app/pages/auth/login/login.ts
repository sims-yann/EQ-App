import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {

  email = "";
  password = "";

  constructor(private router: Router) {}

  login() {
    // TEMP LOGIC — replace with backend later
    if (this.email && this.password) {
      this.router.navigate(['/dashboard']);
    }
  }
}
