import { CommonDictionaryModel } from 'src/app/common/models';
import { InventoryItemTypeDependencyModel } from './inventory-item-type-dependency.model';

export class InventoryItemTypeModel {
  id: number;
  itemGroupId: number;
  name: string;
  riskDescription: string;
  usage: string;
  description: string;
  tagIds: number[];
  pictogramImages: CommonDictionaryModel[];
  dangerLabelImages: CommonDictionaryModel[];
  dependencies: InventoryItemTypeDependencyModel[];
}
