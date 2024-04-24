import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { EtatTache, PrioriteTache, Tache } from '../models/tache.model';
import { TacheService } from '../tache.service';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-tache-dialog',
  standalone: true,
  imports: [
    MatTableModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    CommonModule
  ],
  templateUrl: './tache-dialog.component.html',
  styleUrls: ['./tache-dialog.component.css']
})
export class TacheDialogComponent implements OnInit {
  addTaskForm: FormGroup;
  
  PrioriteTacheValues = Object.values(PrioriteTache);
  EtatTacheValues = Object.values(EtatTache);
  @Output() taskAdded: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    public tacheService: TacheService, private datePipe: DatePipe, public dialogRef: MatDialogRef<TacheDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

  }

  ngOnInit(): void {
    this.addTaskForm = new FormGroup({
      titre: new FormControl('', Validators.required),
      priorite: new FormControl('', Validators.required),
      date_debut: new FormControl('', Validators.required),
      date_fin: new FormControl('', Validators.required),
      etat: new FormControl('', Validators.required)
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.addTaskForm.valid) {
      console.log(this.addTaskForm.value);
      const newTask: Tache = {
        ...this.addTaskForm.value,
        date_debut: this.datePipe.transform(this.addTaskForm.value.date_debut, 'yyyy-MM-dd'),
        date_fin: this.datePipe.transform(this.addTaskForm.value.date_fin, 'yyyy-MM-dd'),
        priorite: this.getPrioriteEnumValue(this.addTaskForm.value.priorite) as PrioriteTache,
        etat: this.getEtatEnumValue(this.addTaskForm.value.etat) as EtatTache
      };
  
      console.log('New Task:', newTask);
  
      this.tacheService.addTache(newTask).subscribe(
        (addedTask: Tache) => {
          console.log('Task added:', addedTask);
          this.dialogRef.close(addedTask);
        },
        (error) => {
          console.error('Error adding task:', error);
          console.log('Error status:', error.status);
          console.log('Error message:', error.message);
          console.log('Error body:', error.error);
          // Handle error appropriately, e.g., show an error message
        }
      );
    }
  }

  getEnumByLabel(label: string, enumObject: any): any {
    // Iterate through enum values to find the matching value (case-sensitive)
    for (const key in enumObject) {
      if (enumObject.hasOwnProperty(key) && enumObject[key] === label) {
        return enumObject[key];
      }
    }
    return null; // Return null if no matching value found
  }

  getPrioriteEnumValue(priority: string): PrioriteTache {
    switch (priority) {
      case 'Elevée':
        return PrioriteTache.Elevee;
      case 'Moyenne':
        return PrioriteTache.Moyenne;
      case 'Faible':
        return PrioriteTache.Faible;
      default:
        return PrioriteTache.Elevee;
    }
  }

  getEtatEnumValue(etat: string): EtatTache {
    switch (etat) {
      case 'À faire':
        return EtatTache.A_FAIRE;
      case 'En cours':
        return EtatTache.EN_COURS;
      case 'Terminé':
        return EtatTache.TERMINE;
      default:
        return EtatTache.A_FAIRE;
    }
  }
}
