import { PagedEntityRequest } from 'src/app/common/models';

export class InventoryItemTypesRequestModel extends PagedEntityRequest {
  nameFilter: string;
  tagIds: number[];

  constructor() {
    super();
    this.nameFilter = '';
    this.tagIds = [];
  }
}
