export class InventoryItemModel {
  id: number;
  itemType: { id: number; name: string } | null;
  itemGroup: { id: number; name: string } | null;
  location: string;
  customerId: number;
  expirationDate: Date | string;
  sn: string;
  available: boolean;
}
