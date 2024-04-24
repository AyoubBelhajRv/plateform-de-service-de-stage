import { Routes } from '@angular/router';
import { DeroulementComponent } from './deroulement/deroulement.component';
import { TacheComponent } from './tache/tache.component';
import { KanbanBordComponent } from './kanban-bord/kanban-bord.component';
import { TelechargementRapportComponent } from './telechargement-rapport/telechargement-rapport.component';


export const routes: Routes = [
    {path:'deroulement',component : DeroulementComponent},
    {path:'tache',component:TacheComponent},
    {path:'kanban-bord',component : KanbanBordComponent}, 
    {path:'telechargement',component : TelechargementRapportComponent}
    
];
