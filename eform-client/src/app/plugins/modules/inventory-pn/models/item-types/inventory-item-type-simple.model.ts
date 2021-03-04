import { SharedTagModel } from 'src/app/common/models';

export class InventoryItemTypeSimpleModel {
  id: number;
  createdBy: string;
  createdDate: Date;
  description: string;
  parentTypeName: string;
  usage: string;
  riskDescription: string;
  pictogramImageName: string;
  dangerLabelImageName: string;
  name: string;
  comment: string;
  tags: SharedTagModel[];
}
