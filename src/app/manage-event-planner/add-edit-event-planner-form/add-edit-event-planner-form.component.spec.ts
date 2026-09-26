import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditEventPlannerFormComponent } from './add-edit-event-planner-form.component';

describe('AddEditEventPlannerFormComponent', () => {
  let component: AddEditEventPlannerFormComponent;
  let fixture: ComponentFixture<AddEditEventPlannerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditEventPlannerFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditEventPlannerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
