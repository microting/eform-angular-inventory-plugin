export class InventoryItemGroupModel {
  id: number;
  parent: { id: number; name: string } | null;
  name: string;
  description: string;
  code: string;
}
