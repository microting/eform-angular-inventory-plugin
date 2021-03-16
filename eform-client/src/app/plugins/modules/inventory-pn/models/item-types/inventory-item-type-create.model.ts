import {InventoryItemTypeDependencyModel} from './inventory-item-type-dependency.model';

export class InventoryItemTypeCreateModel {
  itemGroupId: number;
  name: string;
  riskDescription: string;
  usage: string;
  description: string;
  tagIds: number[];
  pictogramImages: File[];
  dangerLabelImages: File[];
  dependencies: InventoryItemTypeDependencyModel[];
}
