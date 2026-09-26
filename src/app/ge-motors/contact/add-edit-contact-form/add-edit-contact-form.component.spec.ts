import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditContactFormComponent } from './add-edit-contact-form.component';

describe('AddEditContactFormComponent', () => {
  let component: AddEditContactFormComponent;
  let fixture: ComponentFixture<AddEditContactFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditContactFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditContactFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
