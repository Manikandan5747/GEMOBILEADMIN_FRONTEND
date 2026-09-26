import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddShowroomContactDetailsComponent } from './add-showroom-contact-details.component';

describe('AddShowroomContactDetailsComponent', () => {
  let component: AddShowroomContactDetailsComponent;
  let fixture: ComponentFixture<AddShowroomContactDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddShowroomContactDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddShowroomContactDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
