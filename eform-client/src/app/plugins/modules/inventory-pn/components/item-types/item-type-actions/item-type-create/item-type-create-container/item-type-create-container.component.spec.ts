import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemTypeCreateContainerComponent } from './item-type-create-container.component';

describe('ItemTypeCreateContainerComponent', () => {
  let component: ItemTypeCreateContainerComponent;
  let fixture: ComponentFixture<ItemTypeCreateContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemTypeCreateContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemTypeCreateContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
