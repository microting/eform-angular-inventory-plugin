import { Injectable } from '@angular/core';
import { ItemsStore } from './items-store';
import { Observable } from 'rxjs';
import { OperationDataResult, Paged } from 'src/app/common/models';
import { updateTableSort } from 'src/app/common/helpers';
import { getOffset } from 'src/app/common/helpers/pagination.helper';
import { map } from 'rxjs/operators';
import { ItemsQuery } from './items-query';
import { InventoryPnItemsService } from '../../../services';
import { InventoryItemModel } from '../../../models';

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
        isSortDsc: this.query.pageSetting.pagination.isSortDsc,
        offset: this.query.pageSetting.pagination.offset,
        pageSize: this.query.pageSetting.pagination.pageSize,
        sort: this.query.pageSetting.pagination.sort,
        SNFilter: this.query.pageSetting.pagination.nameFilter,
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
    this.store.update((state) => ({
      pagination: {
        ...state.pagination,
        nameFilter: snFilter,
        offset: 0,
      },
    }));
  }

  updatePageSize(pageSize: number) {
    this.store.update((state) => ({
      pagination: {
        ...state.pagination,
        pageSize: pageSize,
      },
    }));
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
    this.store.update((state) => ({
      pagination: {
        ...state.pagination,
        offset: offset,
      },
    }));
  }

  onDelete() {
    this.total -= 1;
    this.checkOffset();
  }

  onSortTable(sort: string) {
    const localPageSettings = updateTableSort(
      sort,
      this.query.pageSetting.pagination.sort,
      this.query.pageSetting.pagination.isSortDsc
    );
    this.store.update((state) => ({
      pagination: {
        ...state.pagination,
        isSortDsc: localPageSettings.isSortDsc,
        sort: localPageSettings.sort,
      },
    }));
  }

  checkOffset() {
    const newOffset = getOffset(
      this.query.pageSetting.pagination.pageSize,
      this.query.pageSetting.pagination.offset,
      this.total
    );
    if (newOffset !== this.query.pageSetting.pagination.offset) {
      this.store.update((state) => ({
        pagination: {
          ...state.pagination,
          offset: newOffset,
        },
      }));
    }
  }
}
