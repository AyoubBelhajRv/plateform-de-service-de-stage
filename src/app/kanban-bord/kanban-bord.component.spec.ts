import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KanbanBordComponent } from './kanban-bord.component';

describe('KanbanBordComponent', () => {
  let component: KanbanBordComponent;
  let fixture: ComponentFixture<KanbanBordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KanbanBordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KanbanBordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
