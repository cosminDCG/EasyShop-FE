import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepPageComponent } from './rep-page.component';

describe('RepPageComponent', () => {
  let component: RepPageComponent;
  let fixture: ComponentFixture<RepPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
