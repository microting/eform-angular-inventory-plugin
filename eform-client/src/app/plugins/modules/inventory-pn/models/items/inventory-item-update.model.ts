export class InventoryItemUpdateModel {
  id: number;
  itemTypeId: number;
  itemGroupId: number;
  location: string;
  customerId: number;
  expirationDate: string | Date;
  sn: string;
  available: boolean;
}
