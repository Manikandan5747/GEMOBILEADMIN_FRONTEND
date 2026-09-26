import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditQuotationComponent } from './add-edit-quotation.component';

describe('AddEditQuotationComponent', () => {
  let component: AddEditQuotationComponent;
  let fixture: ComponentFixture<AddEditQuotationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditQuotationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditQuotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
