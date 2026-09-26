import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCorporateIconComponent } from './view-corporate-icon.component';

describe('ViewCorporateIconComponent', () => {
  let component: ViewCorporateIconComponent;
  let fixture: ComponentFixture<ViewCorporateIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCorporateIconComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCorporateIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
