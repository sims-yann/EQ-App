import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-academic-years',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './academic-years.html',
  styleUrls: ['./academic-years.scss']
})
export class AcademicYearsComponent {

  // 🔹 Modal & Delete confirmation flags
  modalOpen = false;
  deleteConfirmOpen = false;

  // 🔹 Currently edited year
  editingYear: any = null;

  // 🔹 Academic years list
  years = [
    { title: '2024 - 2025', start: '2024-09-01', end: '2025-06-30' },
    { title: '2023 - 2024', start: '2023-09-01', end: '2024-06-30' }
  ];

  // 🔹 New / edited year model
  newYear = {
    title: '',
    start: '',
    end: ''
  };


  openCreateModal() {
    this.editingYear = null; // new mode
    this.newYear = { title: '', start: '', end: '' };
    this.modalOpen = true;
  }

  openEditModal(year: any) {
    this.editingYear = year;
    this.newYear = { ...year }; // fill inputs
    this.modalOpen = true;
  }

  saveYear() {
    if (this.editingYear) {
      // Update existing year
      Object.assign(this.editingYear, this.newYear);
    } else {
      // Create new year
      this.years.push({ ...this.newYear });
    }

    this.modalOpen = false;
  }

  yearToDelete: any = null;

  openDeleteConfirm(year: any) {
    this.yearToDelete = year;
    this.deleteConfirmOpen = true;
  }

  cancelDelete() {
    this.yearToDelete = null;
    this.deleteConfirmOpen = false;
  }

  deleteYear() {
    this.years = this.years.filter(y => y !== this.yearToDelete);
    this.deleteConfirmOpen = false;
  }
}
