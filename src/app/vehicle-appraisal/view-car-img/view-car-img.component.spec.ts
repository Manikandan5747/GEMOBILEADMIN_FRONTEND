import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCarImgComponent } from './view-car-img.component';

describe('ViewCarImgComponent', () => {
  let component: ViewCarImgComponent;
  let fixture: ComponentFixture<ViewCarImgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCarImgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCarImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
