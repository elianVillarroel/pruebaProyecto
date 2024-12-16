import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Registroevento2Component } from './registroevento2.component';

describe('Registroevento2Component', () => {
  let component: Registroevento2Component;
  let fixture: ComponentFixture<Registroevento2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Registroevento2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Registroevento2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
