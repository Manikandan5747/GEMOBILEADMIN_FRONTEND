import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignLinkComponent } from './sign-link.component';

describe('SignLinkComponent', () => {
  let component: SignLinkComponent;
  let fixture: ComponentFixture<SignLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignLinkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
