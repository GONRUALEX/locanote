import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotasInfoPage } from './notas-info.page';

describe('NotasInfoPage', () => {
  let component: NotasInfoPage;
  let fixture: ComponentFixture<NotasInfoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(NotasInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
