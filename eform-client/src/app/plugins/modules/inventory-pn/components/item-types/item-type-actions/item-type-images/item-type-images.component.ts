import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { InventoryPnImageTypesEnum } from '../../../../enums';

@Component({
  selector: 'app-item-type-images',
  templateUrl: './item-type-images.component.html',
  styleUrls: ['./item-type-images.component.scss'],
})
export class ItemTypeImagesComponent implements OnInit {
  @Input() uploadedImageNames: string[];
  @Input() processedImages: any[];
  @Input() imageType: InventoryPnImageTypesEnum;
  @Output()
  imageProcessed: EventEmitter<{
    imageType: InventoryPnImageTypesEnum;
    dataUrl: string;
  }> = new EventEmitter<{
    imageType: InventoryPnImageTypesEnum;
    dataUrl: string;
  }>();
  imagesForm: FormGroup;

  constructor(public fb: FormBuilder, public router: Router) {
    this.imagesForm = this.fb.group({
      name: [''],
      avatar: [null],
    });
  }

  ngOnInit() {}

  // Image Preview
  uploadFile(event) {
    // TODO: Change
    const file = (event.target as HTMLInputElement).files[0];
    // this.imagesForm.patchValue({
    //   avatar: file,
    // });
    // this.imagesForm.get('avatar').updateValueAndValidity();

    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imageProcessed.emit({
        dataUrl: reader.result as string,
        imageType: this.imageType,
      });
    };
    reader.readAsDataURL(file);
  }

  deletePicture(image: any) {}
}
