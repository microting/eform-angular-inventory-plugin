import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemGroupCreateModalComponent } from './item-group-create-modal.component';

describe('ItemGroupCreateModalComponent', () => {
  let component: ItemGroupCreateModalComponent;
  let fixture: ComponentFixture<ItemGroupCreateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemGroupCreateModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemGroupCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
