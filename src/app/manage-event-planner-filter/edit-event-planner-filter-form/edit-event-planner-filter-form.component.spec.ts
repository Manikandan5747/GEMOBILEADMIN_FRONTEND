import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEventPlannerFilterFormComponent } from './edit-event-planner-filter-form.component';

describe('EditEventPlannerFilterFormComponent', () => {
  let component: EditEventPlannerFilterFormComponent;
  let fixture: ComponentFixture<EditEventPlannerFilterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditEventPlannerFilterFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEventPlannerFilterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
