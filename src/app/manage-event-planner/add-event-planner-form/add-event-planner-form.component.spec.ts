import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEventPlannerFormComponent } from './add-event-planner-form.component';

describe('AddEventPlannerFormComponent', () => {
  let component: AddEventPlannerFormComponent;
  let fixture: ComponentFixture<AddEventPlannerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEventPlannerFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEventPlannerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
