import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './questions.html',
  styleUrls: ['./questions.scss']
})
export class Questions {

  quiz: any = history.state.quiz;

  modalOpen = false;
  deleteConfirmOpen = false;

  newQuestion = { question: "", A: "", B: "", C: "", D: "", correct_answer: "" };
  editingQuestion: any = null;
  questionToDelete: any = null;

  openCreateModal() {
    this.modalOpen = true;
    this.editingQuestion = null;
    this.newQuestion = { question: "", A: "", B: "", C: "", D: "", correct_answer: "" };
  }

  openEditModal(q: any) {
    this.modalOpen = true;
    this.editingQuestion = q;
    this.newQuestion = { ...q };
  }

  saveQuestion() {
    if (this.editingQuestion) {
      Object.assign(this.editingQuestion, this.newQuestion);
    } else {
      this.quiz.questions.push({ ...this.newQuestion });
    }
    this.modalOpen = false;
  }

  openDeleteConfirm(q: any) {
    this.deleteConfirmOpen = true;
    this.questionToDelete = q;
  }

  cancelDelete() {
    this.deleteConfirmOpen = false;
  }

  deleteQuestion() {
    this.quiz.questions = this.quiz.questions.filter((q: any) => q !== this.questionToDelete);
    this.deleteConfirmOpen = false;
  }
}
