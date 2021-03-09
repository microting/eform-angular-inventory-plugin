export class InventoryItemUpdateModel {
  id: number;
  itemTypeId: number;
  location: string;
  customerId: number;
  expirationDate: string | Date;
  sn: string;
  available: boolean;
}
