import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemGroupsContainerComponent } from './item-groups-container.component';

describe('ItemGroupsContainerComponent', () => {
  let component: ItemGroupsContainerComponent;
  let fixture: ComponentFixture<ItemGroupsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemGroupsContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemGroupsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
