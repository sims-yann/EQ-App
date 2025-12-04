import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './students.html',
  styleUrls: ['./students.scss']
})
export class Students {

  students = [
    { 
      firstName: "Frederic", 
      lastName: "Mewoli", 
      email: "luc.mewoli@saintjeaningenieur.org", 
      matricule: "2223i174", 
      class: "Year 4", 
      password: "123456" 
    }
  ];

  // modal state
  modalOpen = false;
  deleteConfirmOpen = false;

  // editing state
  editingStudent: any = null;
  studentToDelete: any = null;

  // form model
  newStudent = { 
    firstName: "", 
    lastName: "", 
    email: "", 
    matricule: "",  
    class: "", 
    password: "" 
  };

  /** OPEN CREATE MODAL */
  openCreateModal() {
    this.modalOpen = true;
    this.editingStudent = null;
    this.newStudent = { 
      firstName: "", 
      lastName: "", 
      email: "", 
      matricule: "", 
      class: "", 
      password: "" 
    };
  }

  /** OPEN EDIT MODAL */
  editStudent(student: any) {
    this.modalOpen = true;
    this.editingStudent = student;
    this.newStudent = { ...student };
  }

  /** SAVE (CREATE OR EDIT) */
  saveStudent() {
    if (this.editingStudent) {
      Object.assign(this.editingStudent, this.newStudent);
    } else {
      this.students.push({ ...this.newStudent });
    }
    this.closeModal();
  }

  /** CLOSE MODAL */
  closeModal() {
    this.modalOpen = false;
  }

  /** OPEN DELETE CONFIRM */
  deleteStudent(student: any) {
    this.studentToDelete = student;
    this.deleteConfirmOpen = true;
  }

  cancelDelete() {
    this.deleteConfirmOpen = false;
  }

  confirmDelete() {
    this.students = this.students.filter(s => s !== this.studentToDelete);
    this.deleteConfirmOpen = false;
  }
}
