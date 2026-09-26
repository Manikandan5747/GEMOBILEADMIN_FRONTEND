import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEventPlannerFilterFormComponent } from './add-event-planner-filter-form.component';

describe('AddEventPlannerFilterFormComponent', () => {
  let component: AddEventPlannerFilterFormComponent;
  let fixture: ComponentFixture<AddEventPlannerFilterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEventPlannerFilterFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEventPlannerFilterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
