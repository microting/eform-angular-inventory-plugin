import { PagedEntityRequest } from 'src/app/common/models';

export class InventoryItemsRequestModel extends PagedEntityRequest {
  snFilter: string;

  constructor() {
    super();
    this.snFilter = '';
  }
}
