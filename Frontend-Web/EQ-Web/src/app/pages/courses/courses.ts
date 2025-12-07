import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './courses.html',
  styleUrls: ['./courses.scss']

})
export class Courses {

  modalOpen = false;
  deleteConfirmOpen = false;

  classOptions = [
  "Year 1",
  "Year 2",
  "Year 3",
  "Year 4",
  "Year 5"
];

  courses = [
  { title: "Mathematics", description: "Algebra, calculus & more", class: "Year 4", code: "MATH401", lecturer: "Dr. Smith" },
  { title: "Physics", description: "Mechanics & waves", class: "Year 4", code: "PHY402", lecturer: "Dr. Albert" }
];


  newCourse = { title: "", description: "", class: "", code: "", lecturer: "" };
  editingCourse: any = null;
  courseToDelete: any = null;

  openCreateModal() {
  this.modalOpen = true;
  this.editingCourse = null;
  this.newCourse = { title: "", description: "", class: "", code: "", lecturer: "" };
}


  openEditModal(course: any) {
  this.modalOpen = true;
  this.editingCourse = course;
  this.newCourse = { ...course };
}


  saveCourse() {
    if (this.editingCourse) {
      Object.assign(this.editingCourse, this.newCourse);
    } else {
      this.courses.push({ ...this.newCourse });
    }
    this.modalOpen = false;
  }

  openDeleteConfirm(course: any) {
    this.deleteConfirmOpen = true;
    this.courseToDelete = course;
  }

  cancelDelete() {
    this.deleteConfirmOpen = false;
  }

  deleteCourse() {
    this.courses = this.courses.filter(c => c !== this.courseToDelete);
    this.deleteConfirmOpen = false;
  }
}
