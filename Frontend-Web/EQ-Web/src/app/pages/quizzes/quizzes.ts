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

  quizzes = [
    { title: "Midterm Quiz", course: "Mathematics", questions: [] },
    { title: "Intro Quiz", course: "Physics", questions: [] }
  ];

  newQuiz = { title: "", course: "", questions: [] };
  editingQuiz: any = null;
  quizToDelete: any = null;

  openCreateModal() {
    this.modalOpen = true;
    this.editingQuiz = null;
    this.newQuiz = { title: "", course: "", questions: [] };
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
}
