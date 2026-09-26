import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditManageEventComponent } from './edit-event-form.component';

describe('EditEventFormComponent', () => {
  let component: EditManageEventComponent;
  let fixture: ComponentFixture<EditManageEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditManageEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditManageEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
