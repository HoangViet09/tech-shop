import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductViewedComponent } from './product-viewed.component';

describe('ProductViewedComponent', () => {
  let component: ProductViewedComponent;
  let fixture: ComponentFixture<ProductViewedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductViewedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductViewedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
