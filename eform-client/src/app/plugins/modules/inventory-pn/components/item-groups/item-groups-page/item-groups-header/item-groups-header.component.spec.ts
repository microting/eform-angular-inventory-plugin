import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemGroupsHeaderComponent } from './item-groups-header.component';

describe('ItemGroupsHeaderComponent', () => {
  let component: ItemGroupsHeaderComponent;
  let fixture: ComponentFixture<ItemGroupsHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemGroupsHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemGroupsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
