import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditEventTemplateFormComponent } from './add-edit-event-template-form.component';

describe('AddEditEventTemplateFormComponent', () => {
  let component: AddEditEventTemplateFormComponent;
  let fixture: ComponentFixture<AddEditEventTemplateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditEventTemplateFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditEventTemplateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
