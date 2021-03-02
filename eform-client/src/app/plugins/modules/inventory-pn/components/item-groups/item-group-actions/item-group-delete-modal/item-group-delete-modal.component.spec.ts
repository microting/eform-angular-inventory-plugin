import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemGroupDeleteModalComponent } from './item-group-delete-modal.component';

describe('ItemGroupDeleteModalComponent', () => {
  let component: ItemGroupDeleteModalComponent;
  let fixture: ComponentFixture<ItemGroupDeleteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemGroupDeleteModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemGroupDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
