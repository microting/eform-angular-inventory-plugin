import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventorySiteRemoveModalComponent } from './inventory-site-remove-modal.component';

describe('SettingsRemoveSiteModalComponent', () => {
  let component: InventorySiteRemoveModalComponent;
  let fixture: ComponentFixture<InventorySiteRemoveModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventorySiteRemoveModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventorySiteRemoveModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
