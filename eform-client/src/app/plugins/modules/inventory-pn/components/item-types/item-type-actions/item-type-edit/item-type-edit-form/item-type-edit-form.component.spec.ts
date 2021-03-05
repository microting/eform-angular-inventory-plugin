import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemTypeEditFormComponent } from './item-type-edit-form.component';

describe('ItemTypeEditFormComponent', () => {
  let component: ItemTypeEditFormComponent;
  let fixture: ComponentFixture<ItemTypeEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemTypeEditFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemTypeEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
