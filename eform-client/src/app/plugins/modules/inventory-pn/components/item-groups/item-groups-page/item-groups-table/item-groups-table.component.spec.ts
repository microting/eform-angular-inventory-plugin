import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemGroupsTableComponent } from './item-groups-table.component';

describe('ItemGroupsTableComponent', () => {
  let component: ItemGroupsTableComponent;
  let fixture: ComponentFixture<ItemGroupsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemGroupsTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemGroupsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
