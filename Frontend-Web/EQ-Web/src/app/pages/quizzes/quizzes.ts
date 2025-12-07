import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quizzes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quizzes.html',
  styleUrls: ['./quizzes.scss']
})
export class Quizzes {

  constructor(private router: Router) {}

  modalOpen = false;
  deleteConfirmOpen = false;


  evaluationTypes = ["CA", "Midterm", "Final"];

semesters = Array.from({ length: 2 }, (_, i) => `Semester ${i + 1}`);

academicYears = Array.from({ length: 6 }, (_, i) => {
  const current = 2024 + i;
  return `${current}/${current + 1}`;
});

classOptions = ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5"];

statusOptions = ["Draft", "Published"];
  

  quizzes = [
  {
    title: "Midterm Quiz",
    course: "Mathematics",
    evaluationType: "Midterm",
    semester: "Semester 3",
    academicYear: "2024/2025",
    status: "Draft",
    classes: ["Year 4"],
    questions: []
  },
  {
    title: "Intro Quiz",
    course: "Physics",
    evaluationType: "CA",
    semester: "Semester 1",
    academicYear: "2024/2025",
    status: "Published",
    classes: ["Year 4"],
    questions: []
  }
];


  newQuiz = { title: "", course: "", evaluationType: "", semester: "", academicYear: "", status: "Draft", classes: [], questions: []};

  editingQuiz: any = null;
  quizToDelete: any = null;

  openCreateModal() {
    this.modalOpen = true;
    this.editingQuiz = null;
    this.newQuiz = { title: "", course: "", evaluationType: "", semester: "", academicYear: "", status: "Draft", classes: [], questions: []};
  } 

  openEditModal(quiz: any) {
    this.modalOpen = true;
    this.editingQuiz = quiz;
    this.newQuiz = { ...quiz };
  }

  saveQuiz() {
    if (this.editingQuiz) {
      Object.assign(this.editingQuiz, this.newQuiz);
    } else {
      this.quizzes.push({ ...this.newQuiz });
    }
    this.modalOpen = false;
  }

  openDeleteConfirm(quiz: any) {
    this.deleteConfirmOpen = true;
    this.quizToDelete = quiz;
  }

  cancelDelete() {
    this.deleteConfirmOpen = false;
  }

  deleteQuiz() {
    this.quizzes = this.quizzes.filter(q => q !== this.quizToDelete);
    this.deleteConfirmOpen = false;
  }

  openQuestionsPage(quiz: any) {
    this.router.navigate(['/questions'], { state: { quiz } });
  }

  publishQuiz() {
  this.newQuiz.status = "Published";
  alert("Quiz Published Successfully!");
}

}
