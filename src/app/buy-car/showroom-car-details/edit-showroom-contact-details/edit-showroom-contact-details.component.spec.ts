import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditShowroomContactDetailsComponent } from './edit-showroom-contact-details.component';

describe('EditShowroomContactDetailsComponent', () => {
  let component: EditShowroomContactDetailsComponent;
  let fixture: ComponentFixture<EditShowroomContactDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditShowroomContactDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditShowroomContactDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
