import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemTypeCreateFormComponent } from './item-type-create-form.component';

describe('ItemTypeCreateFormComponent', () => {
  let component: ItemTypeCreateFormComponent;
  let fixture: ComponentFixture<ItemTypeCreateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemTypeCreateFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemTypeCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
