import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './classes.html',
  styleUrls: ['./classes.scss'],
})
export class ClassesComponent {

  classes = [
    { name: 'ING1', level: 'L1', capacity: 30 },
    { name: 'ING2', level: 'L2', capacity: 25 },
  ];

  modalOpen = false;
  deleteConfirmOpen = false;
  editingClass: any = null;
  newClass = { name: '', level: '', capacity: 0 };
  classToDelete: any = null;

  openCreateModal() {
    this.editingClass = null;
    this.newClass = { name: '', level: '', capacity: 0 };
    this.modalOpen = true;
  }

  openEditModal(cls: any) {
    this.editingClass = cls;
    this.newClass = { ...cls };
    this.modalOpen = true;
  }

  saveClass() {
    if (this.editingClass) {
      const index = this.classes.indexOf(this.editingClass);
      this.classes[index] = { ...this.newClass };
    } else {
      this.classes.push({ ...this.newClass });
    }
    this.modalOpen = false;
  }

  openDeleteConfirm(cls: any) {
    this.classToDelete = cls;
    this.deleteConfirmOpen = true;
  }

  deleteClass() {
    this.classes = this.classes.filter(c => c !== this.classToDelete);
    this.deleteConfirmOpen = false;
  }

  cancelDelete() {
    this.deleteConfirmOpen = false;
  }
}
