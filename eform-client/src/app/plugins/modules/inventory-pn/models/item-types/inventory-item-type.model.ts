import { InventoryItemGroupModel } from '../item-groups/inventory-item-group.model';
import { CostingMethod, UnitOfMeasure } from '../../enums';

export class InventoryItemTypeModel {
  id: number;
  // no: string;
  // gtinEanUpc: string;
  // description: string;
  // netWeight: number;
  // grossWeight: number;
  // unitVolume: number;
  // costingMethod: CostingMethod | number;
  // unitPrice: number;
  // profitPercent: number;
  // salesUnitOfMeasure: UnitOfMeasure | number;
  // lastPhysicalInventoryDate: string;
  // region: number;
  // itemGroupDependency: InventoryItemGroupModel;
  // usage: string;
  // riscDescription: string;
  // available: boolean;
  // name: string;
  // eformId: number;
  // comment: string;
  // itemTypeDependency: InventoryItemTypeModel[];
  // tags: any[]; // InventoryTagModel

  itemGroupId: number;
  name: string;
  riskDescription: string;
  usage: string;
  description: string;
  tagIds: number[];
  dependencies: [{itemGroupId: number, itemTypesIds: number[]}];
}
