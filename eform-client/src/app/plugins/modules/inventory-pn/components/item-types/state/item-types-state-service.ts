import { Injectable } from '@angular/core';
import { ItemTypesStore } from './item-types-store';
import { Observable } from 'rxjs';
import { OperationDataResult, Paged } from 'src/app/common/models';
import { updateTableSort } from 'src/app/common/helpers';
import { getOffset } from 'src/app/common/helpers/pagination.helper';
import { map } from 'rxjs/operators';
import { ItemTypesQuery } from './item-types-query';
import { InventoryPnItemTypesService } from 'src/app/plugins/modules/inventory-pn/services';
import { InventoryItemTypeSimpleModel } from 'src/app/plugins/modules/inventory-pn/models';
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
        isSortDsc: this.query.pageSetting.isSortDsc,
        offset: this.query.pageSetting.offset,
        pageSize: this.query.pageSetting.pageSize,
        sort: this.query.pageSetting.sort,
        nameFilter: this.query.pageSetting.nameFilter,
        pageIndex: 0,
        tagIds: this.query.pageSetting.tagIds,
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
    this.store.update({ nameFilter: nameFilter, offset: 0 });
  }

  updatePageSize(pageSize: number) {
    this.store.update({ pageSize: pageSize });
    this.checkOffset();
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
    this.store.update(({ tagIds }) => ({
      tagIds: arrayToggle(tagIds, id),
    }));
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
