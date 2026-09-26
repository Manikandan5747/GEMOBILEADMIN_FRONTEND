import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNewSpecialOfferComponent } from './edit-new-special-offer.component';

describe('EditNewSpecialOfferComponent', () => {
  let component: EditNewSpecialOfferComponent;
  let fixture: ComponentFixture<EditNewSpecialOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditNewSpecialOfferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNewSpecialOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
