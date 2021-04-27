import { Injectable } from '@angular/core';
import { ItemTypesStore } from './item-types-store';
import { Observable } from 'rxjs';
import { OperationDataResult, Paged } from 'src/app/common/models';
import { updateTableSort } from 'src/app/common/helpers';
import { getOffset } from 'src/app/common/helpers/pagination.helper';
import { map } from 'rxjs/operators';
import { ItemTypesQuery } from './item-types-query';
import { InventoryPnItemTypesService } from '../../../services';
import { InventoryItemTypeSimpleModel } from '../../../models';
import { arrayToggle } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class ItemTypesStateService {
  constructor(
    private store: ItemTypesStore,
    private service: InventoryPnItemTypesService,
    private query: ItemTypesQuery
  ) {}

  private total: number;

  getAllItemTypes(): Observable<
    OperationDataResult<Paged<InventoryItemTypeSimpleModel>>
  > {
    return this.service
      .getAllItemTypes({
        isSortDsc: this.query.pageSetting.pagination.isSortDsc,
        offset: this.query.pageSetting.pagination.offset,
        pageSize: this.query.pageSetting.pagination.pageSize,
        sort: this.query.pageSetting.pagination.sort,
        nameFilter: this.query.pageSetting.pagination.nameFilter,
        pageIndex: 0,
        tagIds: this.query.pageSetting.pagination.tagIds,
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

  // offset = 0 because we not know total before request
  updateNameFilter(nameFilter: string) {
    this.store.update((state) => ({
      pagination: {
        ...state.pagination,
        nameFilter: nameFilter,
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

  getNameFilter(): Observable<string> {
    return this.query.selectNameFilter$;
  }

  getTagIds(): Observable<number[]> {
    return this.query.selectTagIds$;
  }

  // Adds or removes a value from an array by comparing its values.
  // If a matching value exists it is removed, otherwise it is added to the array.
  addOrRemoveTagIds(id: number) {
    this.store.update((state) => ({
      pagination: {
        ...state.pagination,
        tagIds: arrayToggle(state.pagination.tagIds, id),
      },
    }));
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
