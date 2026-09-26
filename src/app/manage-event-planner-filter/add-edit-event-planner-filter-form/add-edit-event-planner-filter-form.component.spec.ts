import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditEventPlannerFilterFormComponent } from './add-edit-event-planner-filter-form.component';

describe('AddEditEventPlannerFilterFormComponent', () => {
  let component: AddEditEventPlannerFilterFormComponent;
  let fixture: ComponentFixture<AddEditEventPlannerFilterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditEventPlannerFilterFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditEventPlannerFilterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
