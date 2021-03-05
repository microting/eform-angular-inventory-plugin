export class InventoryItemUpdateModel {
  id: number;
  itemTypeId: number;
  location: string;
  customerId: number;
  expirationDate: string | Date;
  SN: string;
  available: boolean;
}
