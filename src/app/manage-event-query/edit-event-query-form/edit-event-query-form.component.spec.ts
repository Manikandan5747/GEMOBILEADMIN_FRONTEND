import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEventQueryFormComponent } from './edit-event-query-form.component';

describe('EditEventQueryFormComponent', () => {
  let component: EditEventQueryFormComponent;
  let fixture: ComponentFixture<EditEventQueryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditEventQueryFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEventQueryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
