import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEventQrCodeComponent } from './manage-event-qr-code.component';

describe('ManageEventQrCodeComponent', () => {
  let component: ManageEventQrCodeComponent;
  let fixture: ComponentFixture<ManageEventQrCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageEventQrCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageEventQrCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
