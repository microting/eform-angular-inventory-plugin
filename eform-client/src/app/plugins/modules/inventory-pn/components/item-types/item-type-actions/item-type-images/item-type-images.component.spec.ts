import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemTypeImagesComponent } from './item-type-images.component';

describe('ItemTypeImagesComponent', () => {
  let component: ItemTypeImagesComponent;
  let fixture: ComponentFixture<ItemTypeImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemTypeImagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemTypeImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
