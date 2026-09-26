import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEventTableFieldFormComponent } from './add-event-table-field-form.component';

describe('AddEventTableFieldFormComponent', () => {
  let component: AddEventTableFieldFormComponent;
  let fixture: ComponentFixture<AddEventTableFieldFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEventTableFieldFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEventTableFieldFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
