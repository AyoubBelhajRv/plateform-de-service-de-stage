import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { jqxKanbanComponent, jqxKanbanModule } from 'jqwidgets-ng/jqxkanban'
import { Tache } from '../models/tache.model';
import { TacheService } from '../tache.service';
@Component({
  selector: 'app-kanban-bord',
  standalone: true,
  imports: [CommonModule, jqxKanbanModule
  ],
  templateUrl: './kanban-bord.component.html',
  styleUrls: ['./kanban-bord.component.css','../../../node_modules/jqwidgets-ng/jqwidgets/styles/jqx.material.css']
})
export class KanbanBordComponent {

  @ViewChild('kanbanReference') mykanban: jqxKanbanComponent;

  public taches : Tache[]  = [];

  constructor(private tacheService: TacheService){
    this.loadtaches();
  }

  public columns: any[] = [
    { text: 'A FAIRE', dataField: 'A_FAIRE', maxItems: 5 },
    { text: 'EN COURS', dataField: 'EN_COURS', maxItems: 5 },
    { text: 'TERMINE', dataField: 'TERMINE', maxItems: 5 }
  ];

  

  public data: any[] = [
    { id: 1, etat: 'EN_COURS', titre: 'Task 1', tags: 'bug,ui,', color: '#5dc3f0', resourceId: 1, date_debut: new Date(), date_fin: new Date(), priorite: 'High' },
    { id: 2, status: 'inProgress', text: 'Task 2', tags: 'bug,', color: '#6bbd49', resourceId: 2, startDate: new Date(), dueDate: new Date(), priority: 'Low' },
    { id: 3, status: 'completed', text: 'Task 3', tags: 'bug,', color: '#5dc3f0', resourceId: 3, startDate: new Date(), dueDate: new Date(), priority: 'Medium' }
  ];

  source = {
    localdata: this.data,
    datafields: [
      { name: 'etat', type: 'string' },
      { name: 'titre', type: 'string' },
      { name: 'tags', type: 'string' },
      { name: 'color', type: 'string' },
      { name: 'etudiant_id', type: 'number' },
      { name: 'date_debut', type: 'date' },
      { name: 'date_fin', type: 'date' },
      { name: 'priorite', type: 'string' }
    ],
    datatype: 'array'
  }

  dataAdapter = new jqx.dataAdapter(this.source);

  resourcesAdapterFunc: any = (): any => {
    let resourcesSource =
    {
      localData:
        [
          { id: 0, name: "No name", common: true },
          { id: 1, name: "Andrew Fuller",  },
          { id: 2, name: "Janet Leverling",  },
          { id: 3, name: "Steven Buchanan",  },
          { id: 4, name: "Nancy Davolio",  },
          { id: 5, name: "Michael Buchanan",  },
          { id: 6, name: "Margaret Buchanan",  },
          { id: 7, name: "Robert Buchanan",  },
          { id: 8, name: "Laura Buchanan",  },
          { id: 9, name: "Laura Buchanan",  }
        ],
      dataType: "array",
      dataFields:
        [
          { name: "id", type: "number" },
          { name: "name", type: "string" },
          { name: "common", type: "boolean" }
        ]
    };
    let resourcesDataAdapter = new jqx.dataAdapter(resourcesSource);
    return resourcesDataAdapter;
  }

  KanbanSettings =
  {
    width: '100%',
    height: '100%',
    columns:
      [
        {
          text: "A FAIRE", dataField: "A_FAIRE", maxItems: 5
        },
        {
          text: "EN COURS", dataField: "EN_COURS", maxItems: 5
        },
        {
          text: "TERMINE", dataField: "TERMINE", maxItems: 5
        }
      ],
    resources: this.resourcesAdapterFunc(),
    source: this.dataAdapter,
    columnRenderer: (element: any, collapsedElement: any, column: any): void => {
      let columnItems = this.mykanban.getColumnItems(column.dataField).length;
      let headerStatus = element[0].getElementsByClassName("jqx-kanban-column-header-status")[0];
      headerStatus.innerHTML = " (" + columnItems + "/" + column.maxItems + ")";
      let collapsedHeaderStatus = collapsedElement[0].getElementsByClassName("jqx-kanban-column-header-status")[0];
      collapsedHeaderStatus.innerHTML = " (" + columnItems + "/" + column.maxItems + ")";
    }
  };

  loadtaches(){
    this.tacheService.getAllTaches().subscribe(
      (taches: Tache[]) => {
        this.taches = taches;
        this.data = this.taches;
      },
      (error) => {
        console.error('Error fetching taches:', error);
        // Handle error appropriately, e.g., show an error message
      })
  }

  ngAfterViewInit(): void {
    this.mykanban.createComponent(this.KanbanSettings);
  }

  public allowDragAndDrop: Boolean = true;
}