import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMobileVersionComponent } from './add-mobile-version.component';

describe('AddMobileVersionComponent', () => {
  let component: AddMobileVersionComponent;
  let fixture: ComponentFixture<AddMobileVersionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMobileVersionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMobileVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
