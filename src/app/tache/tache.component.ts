
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { TacheDialogComponent } from '../tache-dialog/tache-dialog.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { CommonModule, DatePipe } from '@angular/common';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Router } from '@angular/router';
import { Tache } from '../models/tache.model';
import { TacheService } from '../tache.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-tache',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule,MatIconModule],
  providers: [DatePipe],
  templateUrl: './tache.component.html',
  styleUrl: './tache.component.css'
})

export class TacheComponent implements OnInit {
editer() {
throw new Error('Method not implemented.');
}
  tacheList: Tache[] = [];
  dataSource = new MatTableDataSource<Tache>();
  displayedColumns: string[] = ['id', 'subject', 'priority', 'startDate', 'dueDate', 'status','actions'];

  columnMappings: { [key: string]: string } = {

    'subject': 'titre',
    'priority': 'priorite',
    'startDate': 'date_debut',
    'dueDate': 'date_fin',
    'status': 'etat'
  };

  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(public dialog: MatDialog, private router: Router, private tacheService: TacheService) {
    this.dataSource = new MatTableDataSource<Tache>();
  }

  ngOnInit(): void {

    this.dataSource.sort = this.sort;
    this.fetchTachesAndUpdateTable();
  }

  fetchTachesAndUpdateTable(): void {
    this.tacheService.getAllTaches().subscribe(
      (taches: Tache[]) => {
        this.tacheList = taches;
        this.dataSource.data = this.tacheList;
      },
      (error) => {
        console.error('Error fetching taches:', error);
        // Handle error appropriately, e.g., show an error message
      }
    );
    console.log(this.dataSource.data);
  }


  goToKanbanBoard() {
    this.router.navigate(['/kanban-bord']);
  }

  openAddTaskDialog(): void {
    const dialogRef = this.dialog.open(TacheDialogComponent, {
      width: '500px',
      // You can pass data to the dialog if needed
      // data: { }
    });

    dialogRef.afterClosed().subscribe(result => {
      // You can handle the result from the dialog here
      if (result) {
        // Add the new task to your data source
        this.addNewTask(result);
        /* this.dataSource.data.push(result);
        this.dataSource._updateChangeSubscription();  */
      }
    });
  }

  addNewTask(newTask: Tache): void {
    this.tacheService.addTache(newTask).subscribe(
      (addedTask: Tache) => {
        this.fetchTachesAndUpdateTable();
        this.dataSource.data.push(addedTask);
        this.dataSource._updateChangeSubscription(); // Update table data
      },
      (error) => {
        console.error('Error adding new task:', error);
        // Handle error appropriately, e.g., show an error message
      }
    );
  }

  // Function to get priority color
  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'Elevee':
        return 'red';
      case 'Moyenne':
        return 'orange';
      case 'Faible':
        return 'green';
      default:
        return '';
    }
  }

  // Function to get status color
  getStatusColor(status: string): string {
    switch (status) {
      case 'A_FAIRE':
        return 'blue';
      case 'EN_COURS':
        return 'orange';
      case 'TERMINE':
        return 'green';
      default:
        return '';
    }
  }

  // Function to get column header
  getColumnHeader(column: string): string {
    const headers: { [key: string]: string } = {
      'id': 'ID',
      'subject': 'Titre',
      'startDate': 'Date Début',
      'dueDate': 'Due Date',
      'priority': 'Priorité',
      'status': 'Status'
    };
    return headers[column] || '';
  }

  // Function to get cell value
  getCellValue(task: Tache, column: string): any {
    switch (column) {
      case 'id':
        return task.id;
      case 'subject':
        return task.titre;
      case 'startDate':
        return task.date_debut;
      case 'dueDate':
        return task.date_fin;
      case 'priority':
        return task.priorite;
      case 'status':
        return task.etat;
      default:
        return '';
    }
  }

  getColumn(columnName: string): string {
    return this.columnMappings[columnName] || columnName;
  }

  // Function to handle edit task
  editTask(task: Tache): void {
    // You can open a dialog here similar to adding a new task
    // For simplicity, let's log the task ID to console
    console.log('Editing task with ID:', task.id);
  }

  // Function to handle delete task
  deleteTask(taskId: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.tacheService.deleteTache(taskId).subscribe(
        () => {
          // Remove the task from the local list
          this.tacheList = this.tacheList.filter(task => task.id !== taskId);
          // Update the table data source
          this.dataSource.data = this.tacheList;
          // Optionally, show a success message or handle UI updates
        },
        (error) => {
          console.error('Error deleting task:', error);
          // Handle error appropriately, e.g., show an error message
        }
      );
    }
  }
}
