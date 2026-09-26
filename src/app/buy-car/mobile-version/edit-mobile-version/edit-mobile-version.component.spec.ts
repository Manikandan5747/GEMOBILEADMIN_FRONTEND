import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMobileVersionComponent } from './edit-mobile-version.component';

describe('EditMobileVersionComponent', () => {
  let component: EditMobileVersionComponent;
  let fixture: ComponentFixture<EditMobileVersionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditMobileVersionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMobileVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
