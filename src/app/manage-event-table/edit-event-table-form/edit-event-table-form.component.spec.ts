import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEventTableFormComponent } from './edit-event-table-form.component';

describe('EditEventTableFormComponent', () => {
  let component: EditEventTableFormComponent;
  let fixture: ComponentFixture<EditEventTableFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditEventTableFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEventTableFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
