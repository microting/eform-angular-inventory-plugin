export class InventoryItemCreateModel<T> {
  itemTypeId: number;
  itemGroupId: number;
  location: string;
  customerId: number;
  expirationDate: T | null;
  sn: string;
  available: boolean;
}
