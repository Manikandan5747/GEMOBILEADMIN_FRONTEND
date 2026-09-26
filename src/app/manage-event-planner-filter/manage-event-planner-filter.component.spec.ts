import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEventPlannerFilterComponent } from './manage-event-planner-filter.component';

describe('ManageEventPlannerFilterComponent', () => {
  let component: ManageEventPlannerFilterComponent;
  let fixture: ComponentFixture<ManageEventPlannerFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageEventPlannerFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageEventPlannerFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
