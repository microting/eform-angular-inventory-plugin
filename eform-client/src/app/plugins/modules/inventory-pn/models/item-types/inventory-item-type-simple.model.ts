import {CostingMethod, UnitOfMeasure} from '../../enums';
import {InventoryItemGroupModel} from '../item-groups';

export class InventoryItemTypeSimpleModel {
  id: number;
  no: string;
  gtinEanUpc: string;
  description: string;
  netWeight: number;
  grossWeight: number;
  unitVolume: number;
  costingMethod: CostingMethod | number;
  unitPrice: number;
  profitPercent: number;
  salesUnitOfMeasure: UnitOfMeasure | number;
  lastPhysicalInventoryDate: string;
  region: number;
  itemGroupDependency: InventoryItemGroupModel;
  usage: string;
  riscDescription: string;
  available: boolean;
  name: string;
  eformId: number;
  comment: string;
  tags: any[]; // InventoryTagModel
}
