import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCorporatePartnersComponent } from './add-corporate-partners.component';

describe('AddCorporatePartnersComponent', () => {
  let component: AddCorporatePartnersComponent;
  let fixture: ComponentFixture<AddCorporatePartnersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCorporatePartnersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCorporatePartnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
