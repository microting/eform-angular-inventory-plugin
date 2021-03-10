import { PagedEntityRequest } from 'src/app/common/models';

export class InventoryItemsRequestModel extends PagedEntityRequest {
  SNFilter: string;
  itemGroupId: number;

  constructor() {
    super();
    this.SNFilter = '';
    this.itemGroupId = null;
  }
}
