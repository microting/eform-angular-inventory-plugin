import { Injectable } from '@angular/core';
import { ItemsStore } from './items-store';
import { Observable } from 'rxjs';
import { OperationDataResult, Paged } from 'src/app/common/models';
import { updateTableSort } from 'src/app/common/helpers';
import { getOffset } from 'src/app/common/helpers/pagination.helper';
import { map } from 'rxjs/operators';
import { ItemsQuery } from './items-query';
import { InventoryPnItemsService } from 'src/app/plugins/modules/inventory-pn/services';
import { InventoryItemModel } from 'src/app/plugins/modules/inventory-pn/models';

@Injectable({ providedIn: 'root' })
export class ItemsStateService {
  constructor(
    private store: ItemsStore,
    private service: InventoryPnItemsService,
    private query: ItemsQuery
  ) {}

  private total: number;
  private itemGroupId: number;

  getAllItems(): Observable<OperationDataResult<Paged<InventoryItemModel>>> {
    return this.service
      .getAllItems({
        isSortDsc: this.query.pageSetting.isSortDsc,
        offset: this.query.pageSetting.offset,
        pageSize: this.query.pageSetting.pageSize,
        sort: this.query.pageSetting.sort,
        SNFilter: this.query.pageSetting.snFilter,
        pageIndex: 0,
        itemGroupId: this.itemGroupId,
      })
      .pipe(
        map((response) => {
          if (response && response.success && response.model) {
            this.total = response.model.total;
          }
          return response;
        })
      );
  }

  setItemGroupId(itemGroupId: number) {
    this.itemGroupId = itemGroupId;
  }

  updateSnFilter(snFilter: string) {
    this.store.update({ snFilter: snFilter, offset: 0 });
  }

  updatePageSize(pageSize: number) {
    this.store.update({ pageSize: pageSize });
    this.checkOffset();
  }

  getOffset(): Observable<number> {
    return this.query.selectOffset$;
  }

  getPageSize(): Observable<number> {
    return this.query.selectPageSize$;
  }

  getSort(): Observable<string> {
    return this.query.selectSort$;
  }

  getIsSortDsc(): Observable<boolean> {
    return this.query.selectIsSortDsc$;
  }

  getSnFilter(): Observable<string> {
    return this.query.selectSnFilter$;
  }

  changePage(offset: number) {
    this.store.update({
      offset: offset,
    });
  }

  onDelete() {
    this.total -= 1;
    this.checkOffset();
  }

  onSortTable(sort: string) {
    const localPageSettings = updateTableSort(
      sort,
      this.query.pageSetting.sort,
      this.query.pageSetting.isSortDsc
    );
    this.store.update({
      isSortDsc: localPageSettings.isSortDsc,
      sort: localPageSettings.sort,
    });
  }

  checkOffset() {
    const newOffset = getOffset(
      this.query.pageSetting.pageSize,
      this.query.pageSetting.offset,
      this.total
    );
    if (newOffset !== this.query.pageSetting.offset) {
      this.store.update({
        offset: newOffset,
      });
    }
  }
}
