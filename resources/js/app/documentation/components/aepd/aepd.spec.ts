import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Aepd } from './aepd';

describe('Aepd', () => {
  let component: Aepd;
  let fixture: ComponentFixture<Aepd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Aepd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Aepd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
