import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalLanguagePage } from './modal-language.page';

describe('ModalLanguagePage', () => {
  let component: ModalLanguagePage;
  let fixture: ComponentFixture<ModalLanguagePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ModalLanguagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
