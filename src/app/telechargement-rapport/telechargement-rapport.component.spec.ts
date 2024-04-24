import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelechargementRapportComponent } from './telechargement-rapport.component';

describe('TelechargementRapportComponent', () => {
  let component: TelechargementRapportComponent;
  let fixture: ComponentFixture<TelechargementRapportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelechargementRapportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TelechargementRapportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
