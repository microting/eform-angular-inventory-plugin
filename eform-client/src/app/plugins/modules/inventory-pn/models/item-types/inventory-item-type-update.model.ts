export class InventoryItemTypeUpdateModel {
  id: number;
  itemGroupId: number;
  name: string;
  riskDescription: string;
  usage: string;
  description: string;
  tagIds: number[];
  pictogramImages: File[];
  dangerLabelImages: File[];
  pictogramImagesForDelete: string[];
  dangerLabelImagesForDelete: string[];
  dependencies: [{itemGroupId: number, itemTypesIds: number[]}];
}
