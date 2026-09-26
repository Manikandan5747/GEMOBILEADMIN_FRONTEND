import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditEventQueryFormComponent } from './add-edit-event-query-form.component';

describe('AddEditEventQueryFormComponent', () => {
  let component: AddEditEventQueryFormComponent;
  let fixture: ComponentFixture<AddEditEventQueryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditEventQueryFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditEventQueryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
