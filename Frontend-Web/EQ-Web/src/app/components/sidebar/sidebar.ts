import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss']
})
export class Sidebar {

  // IMPORTANT: use "route", not "path"
  menuItems = [
    { label: 'Dashboard',         icon: 'dashboard', route: '/dashboard' },
    { label: 'Students',          icon: 'students',  route: '/students' },
    { label: 'Classes',           icon: 'classes',   route: '/classes' },
    { label: 'Courses',           icon: 'courses',   route: '/courses' },
    { label: 'Academic Years',    icon: 'academic',  route: '/academic-years' },
    { label: 'Questions',         icon: 'questions', route: '/questions' },
    { label: 'Quizzes',           icon: 'quizzes',   route: '/quizzes' },
    { label: 'Statistics',        icon: 'stats',     route: '/statistics' },
    { label: 'Sentiment Analysis',icon: 'sentiment', route: '/sentiment-analysis' },
  ];
}
