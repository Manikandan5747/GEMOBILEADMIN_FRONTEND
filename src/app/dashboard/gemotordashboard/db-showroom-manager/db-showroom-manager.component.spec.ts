import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbShowroomManagerComponent } from './db-showroom-manager.component';

describe('DbShowroomManagerComponent', () => {
  let component: DbShowroomManagerComponent;
  let fixture: ComponentFixture<DbShowroomManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DbShowroomManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DbShowroomManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
