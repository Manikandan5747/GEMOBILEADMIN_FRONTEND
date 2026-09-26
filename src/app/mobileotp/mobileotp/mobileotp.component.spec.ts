import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileotpComponent } from './mobileotp.component';

describe('MobileotpComponent', () => {
  let component: MobileotpComponent;
  let fixture: ComponentFixture<MobileotpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileotpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileotpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
