export class InventoryItemModel {
  id: number;
  itemType: number;
  location: string;
  customerId: number;
  expirationDate: Date | string;
  SN: string;
  available: boolean;
}
