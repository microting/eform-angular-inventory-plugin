import { PagedEntityRequest } from 'src/app/common/models';

export class InventoryItemsRequestModel extends PagedEntityRequest {
  SNFilter: string;

  constructor() {
    super();
    this.SNFilter = '';
  }
}
