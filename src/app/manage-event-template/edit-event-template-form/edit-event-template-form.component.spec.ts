import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEventTemplateFormComponent } from './edit-event-template-form.component';

describe('EditEventTemplateFormComponent', () => {
  let component: EditEventTemplateFormComponent;
  let fixture: ComponentFixture<EditEventTemplateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditEventTemplateFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEventTemplateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
