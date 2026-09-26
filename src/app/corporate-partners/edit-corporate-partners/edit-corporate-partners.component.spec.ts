import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCorporatePartnersComponent } from './edit-corporate-partners.component';

describe('EditCorporatePartnersComponent', () => {
  let component: EditCorporatePartnersComponent;
  let fixture: ComponentFixture<EditCorporatePartnersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCorporatePartnersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCorporatePartnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
