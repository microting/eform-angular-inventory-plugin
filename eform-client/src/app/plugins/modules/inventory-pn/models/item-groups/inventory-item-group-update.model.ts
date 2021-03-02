export class InventoryItemGroupUpdateModel {
  id: number;
  no: string;
  name: string;
  gtinEanUpc: string;
  description: string;
  netWeight: number;
  grossWeight: number;
  unitVolume: number;
  costingMethod: number; // CostingMethod
  unitPrice: number;
  profitPercent: number;
  salesUnitOfMeasure: number; // UnitOfMeasure
  lastPhysicalInventoryDate: string;
  region: number;
  usage: string;
  riscDescription: string;
  available: boolean;
  eformId: number;
  comment: string;
}
