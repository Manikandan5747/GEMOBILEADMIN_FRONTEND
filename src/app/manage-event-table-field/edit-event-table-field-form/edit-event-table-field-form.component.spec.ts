import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEventTableFieldFormComponent } from './edit-event-table-field-form.component';

describe('EditEventTableFieldFormComponent', () => {
  let component: EditEventTableFieldFormComponent;
  let fixture: ComponentFixture<EditEventTableFieldFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditEventTableFieldFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEventTableFieldFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
