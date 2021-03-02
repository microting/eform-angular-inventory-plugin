import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemTypeDeleteModalComponent } from './item-type-delete-modal.component';

describe('ItemTypeDeleteModalComponent', () => {
  let component: ItemTypeDeleteModalComponent;
  let fixture: ComponentFixture<ItemTypeDeleteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemTypeDeleteModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemTypeDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
