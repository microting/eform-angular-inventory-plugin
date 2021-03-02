import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventorySiteAddModalComponent } from './inventory-site-add-modal.component';

describe('SettingsAddSiteModalComponent', () => {
  let component: InventorySiteAddModalComponent;
  let fixture: ComponentFixture<InventorySiteAddModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventorySiteAddModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventorySiteAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
