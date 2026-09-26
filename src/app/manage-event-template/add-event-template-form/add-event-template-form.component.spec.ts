import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEventTemplateFormComponent } from './add-event-template-form.component';

describe('AddEventTemplateFormComponent', () => {
  let component: AddEventTemplateFormComponent;
  let fixture: ComponentFixture<AddEventTemplateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEventTemplateFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEventTemplateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
