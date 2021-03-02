import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemGroupEditModalComponent } from './item-group-edit-modal.component';

describe('ItemGroupEditModalComponent', () => {
  let component: ItemGroupEditModalComponent;
  let fixture: ComponentFixture<ItemGroupEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemGroupEditModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemGroupEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
