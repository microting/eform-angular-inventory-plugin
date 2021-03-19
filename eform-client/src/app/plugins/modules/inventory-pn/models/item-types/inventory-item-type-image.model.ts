import {InventoryPnImageTypesEnum} from '../../enums';

export class InventoryItemTypeImageModel {
  imageType: InventoryPnImageTypesEnum;
  dataUrl: string;
  file: File;
}
