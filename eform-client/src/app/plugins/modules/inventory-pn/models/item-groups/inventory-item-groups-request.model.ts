import { PagedEntityRequest } from 'src/app/common/models';

export class InventoryItemGroupsRequestModel extends PagedEntityRequest {
  nameFilter: string;

  constructor() {
    super();
    this.nameFilter = '';
  }
}
