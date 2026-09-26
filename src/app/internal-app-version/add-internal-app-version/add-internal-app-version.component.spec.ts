import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInternalAppVersionComponent } from './add-internal-app-version.component';

describe('AddInternalAppVersionComponent', () => {
  let component: AddInternalAppVersionComponent;
  let fixture: ComponentFixture<AddInternalAppVersionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddInternalAppVersionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInternalAppVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
