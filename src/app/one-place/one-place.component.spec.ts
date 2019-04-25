import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnePlaceComponent } from './one-place.component';

describe('OnePlaceComponent', () => {
  let component: OnePlaceComponent;
  let fixture: ComponentFixture<OnePlaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnePlaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnePlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
