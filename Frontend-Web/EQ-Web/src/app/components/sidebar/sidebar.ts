import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class Sidebar {

  // IMPORTANT: use "route", not "path"
  menuItems = [
  { label: 'Dashboard', icon: 'material-symbols:dashboard-rounded', route: '/dashboard' },
  { label: 'Students', icon: 'mdi:account-group', route: '/students' },
  { label: 'Classes', icon: 'mdi:google-classroom', route: '/classes' },
  { label: 'Courses', icon: 'mdi:book-education', route: '/courses' },
  { label: 'Academic Years', icon: 'mdi:calendar-range', route: '/academic-years' },
  { label: 'Quizzes', icon: 'mdi:clipboard-text-multiple', route: '/quizzes' },
  { label: 'Sentiment Analysis', icon: 'mdi:emoticon-happy-outline', route: '/sentiment-analysis' }
];


}
