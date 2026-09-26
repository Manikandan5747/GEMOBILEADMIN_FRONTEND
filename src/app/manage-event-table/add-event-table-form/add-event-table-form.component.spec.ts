import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEventTableFormComponent } from './add-event-table-form.component';

describe('AddEventTableFormComponent', () => {
  let component: AddEventTableFormComponent;
  let fixture: ComponentFixture<AddEventTableFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEventTableFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEventTableFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
