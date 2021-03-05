import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemTypeEditContainerComponent } from './item-type-edit-container.component';

describe('ItemTypeEditContainerComponent', () => {
  let component: ItemTypeEditContainerComponent;
  let fixture: ComponentFixture<ItemTypeEditContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemTypeEditContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemTypeEditContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
