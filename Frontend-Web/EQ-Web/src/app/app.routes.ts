import { Routes } from '@angular/router';
import { Admin } from './layouts/admin/admin';
import { AuthLayout } from './layouts/auth/auth';
import { AuthGuard } from './core/guards/auth.guard';

import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';

import { Dashboard } from './pages/dashboard/dashboard';
import { Students } from './pages/students/students';
import { ClassesComponent } from './pages/classes/classes';
import { Courses } from './pages/courses/courses';
import { AcademicYearsComponent } from './pages/academic-years/academic-years';
import { Quizzes } from './pages/quizzes/quizzes';
import { SentimentAnalysis } from './pages/sentiment-analysis/sentiment-analysis';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: Login },
  { path: 'register', component: Register },

  {
    path: '',
    component: Admin,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'students', component: Students },
      { path: 'classes', component: ClassesComponent },
      { path: 'courses', component: Courses },
      { path: 'academic-years', component: AcademicYearsComponent },
      { path: 'quizzes', component: Quizzes },
      { path: 'sentiment-analysis', component: SentimentAnalysis },
    ]
  }
];
