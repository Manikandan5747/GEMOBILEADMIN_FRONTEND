import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEventPlannerComponent } from './manage-event-planner.component';

describe('ManageEventPlannerComponent', () => {
  let component: ManageEventPlannerComponent;
  let fixture: ComponentFixture<ManageEventPlannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageEventPlannerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageEventPlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
