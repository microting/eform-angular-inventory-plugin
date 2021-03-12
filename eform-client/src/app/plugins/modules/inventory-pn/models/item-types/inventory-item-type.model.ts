import { InventoryItemGroupModel } from '../item-groups/inventory-item-group.model';
import { CostingMethod, UnitOfMeasure } from '../../enums';

export class InventoryItemTypeModel {
  id: number;
  itemGroupId: number;
  name: string;
  riskDescription: string;
  usage: string;
  description: string;
  tagIds: number[];
  pictogramImages: string[];
  dangerLabelImages: string[];
  dependencies: [{itemGroupId: number, itemTypesIds: number[]}];
}
