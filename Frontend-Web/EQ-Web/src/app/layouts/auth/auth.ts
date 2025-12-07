import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './auth.html',
  styleUrls: ['./auth.scss']
})
export class AuthLayout {}
