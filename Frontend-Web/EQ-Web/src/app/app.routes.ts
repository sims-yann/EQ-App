import { Routes } from '@angular/router';
import { Admin } from './layouts/admin/admin';
import { Dashboard } from './pages/dashboard/dashboard';
import { Students } from './pages/students/students';
import { ClassesComponent } from './pages/classes/classes';
import { Courses } from './pages/courses/courses';
import { AcademicYearsComponent } from './pages/academic-years/academic-years';
import { Questions } from './pages/questions/questions';
import { Quizzes } from './pages/quizzes/quizzes';
import { Statistics } from './pages/statistics/statistics';
import { SentimentAnalysis } from './pages/sentiment-analysis/sentiment-analysis';

export const routes: Routes = [
  {
    path: '',
    component: Admin,
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'students', component: Students },
      { path: 'classes', component: ClassesComponent   },
      { path: 'courses', component: Courses },
      { path: 'academic-years', component: AcademicYearsComponent },
      { path: 'questions', component: Questions },
      { path: 'quizzes', component: Quizzes },
      { path: 'statistics', component: Statistics },
      { path: 'sentiment-analysis', component: SentimentAnalysis },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    
    ]
  }
  
];
