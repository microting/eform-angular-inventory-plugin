import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonDictionaryModel } from 'src/app/common/models';
import { InventoryPnImageTypesEnum } from '../../../../enums';
import { InventoryItemTypeImageModel } from '../../../../models';

@Component({
  selector: 'app-item-type-images',
  templateUrl: './item-type-images.component.html',
  styleUrls: ['./item-type-images.component.scss'],
})
export class ItemTypeImagesComponent implements OnInit {
  @Input() uploadedImages: CommonDictionaryModel[];
  @Input() processedImages: InventoryItemTypeImageModel[];
  @Input() imageType: InventoryPnImageTypesEnum;
  @Output()
  imageProcessed: EventEmitter<InventoryItemTypeImageModel> = new EventEmitter<InventoryItemTypeImageModel>();
  @Output()
  deleteImage: EventEmitter<{
    imageIndex: number;
    imageType: InventoryPnImageTypesEnum;
  }> = new EventEmitter<{
    imageIndex: number;
    imageType: InventoryPnImageTypesEnum;
  }>();
  @Output()
  deleteUploadedImage: EventEmitter<{
    imageId: number;
    imageType: InventoryPnImageTypesEnum;
  }> = new EventEmitter<{
    imageId: number;
    imageType: InventoryPnImageTypesEnum;
  }>();
  url = '/api/images';

  constructor() {}

  ngOnInit() {}

  uploadFile(event) {
    const file = (event.target as HTMLInputElement).files[0];

    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imageProcessed.emit({
        dataUrl: reader.result as string,
        imageType: this.imageType,
        file,
      });
    };
    reader.readAsDataURL(file);
  }

  onDeleteImage(imageIndex: number, imageType: InventoryPnImageTypesEnum) {
    this.deleteImage.emit({ imageIndex, imageType });
  }

  onDeleteUploadedImage(imageId: number) {
    this.deleteUploadedImage.emit({ imageId, imageType: this.imageType });
  }
}
