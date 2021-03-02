import {InventoryItemTypeModel} from '../item-types/inventory-item-type.model';

export class InventoryItemGroupModel {
  id: number;
  no: string;
  gtinEanUpc: string;
  description: string;
  netWeight: number;
  grossWeight: number;
  unitVolume: number;
  costingMethod: number; // CostingMethod;
  unitPrice: number;
  profitPercent: number;
  salesUnitOfMeasure: number; // UnitOfMeasure;
  lastPhysicalInventoryDate: string;
  region: number;
  itemGroupDependency: InventoryItemGroupModel;
  usage: string;
  riscDescription: string;
  available: boolean;
  name: string;
  eformId: number;
  comment: string;
  itemTypeDependency: InventoryItemTypeModel[];
  tags: any[]; // InventoryTagModel
}
