import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkBlueButtonComponent } from './dark-blue-button.component';

describe('DarkBlueButtonComponent', () => {
  let component: DarkBlueButtonComponent;
  let fixture: ComponentFixture<DarkBlueButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DarkBlueButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DarkBlueButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
