import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEventPlannerFormComponent } from './edit-event-planner-form.component';

describe('EditEventPlannerFormComponent', () => {
  let component: EditEventPlannerFormComponent;
  let fixture: ComponentFixture<EditEventPlannerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditEventPlannerFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEventPlannerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
