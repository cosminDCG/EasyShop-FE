import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheapestProdComponent } from './cheapest-prod.component';

describe('CheapestProdComponent', () => {
  let component: CheapestProdComponent;
  let fixture: ComponentFixture<CheapestProdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheapestProdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheapestProdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
