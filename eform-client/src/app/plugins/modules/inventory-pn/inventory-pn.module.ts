import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonsModule,
  InputsModule,
  ModalModule,
  TableModule,
  TooltipModule,
  WavesModule,
} from 'angular-bootstrap-md';
import {OwlDateTimeModule} from 'ng-pick-datetime-ex';
import { EformSharedTagsModule } from 'src/app/common/modules/eform-shared-tags/eform-shared-tags.module';
import { EformSharedModule } from 'src/app/common/modules/eform-shared/eform-shared.module';
import { SharedPnModule } from '../shared/shared-pn.module';
import {
  InventoryFoldersModalComponent,
  InventorySettingsComponent,
  InventorySiteAddModalComponent,
  InventorySiteRemoveModalComponent,
  ItemCreateModalComponent,
  ItemDeleteModalComponent,
  ItemEditModalComponent,
  ItemGroupCreateModalComponent,
  ItemGroupDeleteModalComponent,
  ItemGroupEditModalComponent,
  ItemGroupsContainerComponent,
  ItemGroupsHeaderComponent,
  ItemGroupsTableComponent,
  ItemsContainerComponent,
  ItemsPageHeaderComponent,
  ItemsPageTableComponent,
  ItemTypeCreateContainerComponent,
  ItemTypeCreateFormComponent,
  ItemTypeDeleteModalComponent,
  ItemTypeEditContainerComponent,
  ItemTypeEditFormComponent,
  ItemTypesContainerComponent,
  ItemTypesHeaderComponent,
  ItemTypesTableComponent,
  ItemTypeTagsComponent,
} from './components';
import { InventoryPnRouting } from './inventory-pn.routing';
import { InventoryPnLayoutComponent } from './layouts';
import {
  InventoryPnItemGroupsService,
  InventoryPnItemsService,
  InventoryPnItemTypesService,
  InventoryPnItemTypeTagsService,
  InventoryPnSettingsService,
} from './services';

@NgModule({
  declarations: [
    InventorySettingsComponent,
    InventoryFoldersModalComponent,
    InventorySiteRemoveModalComponent,
    InventorySiteAddModalComponent,
    InventoryPnLayoutComponent,
    ItemsContainerComponent,
    ItemsPageHeaderComponent,
    ItemsPageTableComponent,
    ItemDeleteModalComponent,
    ItemCreateModalComponent,
    ItemEditModalComponent,
    ItemTypesContainerComponent,
    ItemTypesHeaderComponent,
    ItemTypesTableComponent,
    ItemTypeDeleteModalComponent,
    ItemTypeCreateContainerComponent,
    ItemTypeCreateFormComponent,
    ItemTypeEditContainerComponent,
    ItemTypeEditFormComponent,
    ItemGroupsContainerComponent,
    ItemGroupsTableComponent,
    ItemGroupsHeaderComponent,
    ItemGroupCreateModalComponent,
    ItemGroupEditModalComponent,
    ItemGroupDeleteModalComponent,

    ItemTypeTagsComponent,
  ],
  imports: [
    CommonModule,
    InventoryPnRouting,
    InputsModule,
    FormsModule,
    TableModule,
    TranslateModule,
    FontAwesomeModule,
    TooltipModule,
    ButtonsModule,
    RouterModule,
    NgSelectModule,
    ModalModule,
    EformSharedModule,
    SharedPnModule,
    WavesModule,
    EformSharedTagsModule,
    OwlDateTimeModule,
  ],
  providers: [
    InventoryPnItemsService,
    InventoryPnSettingsService,
    InventoryPnItemGroupsService,
    InventoryPnItemTypesService,
    InventoryPnItemTypeTagsService,
  ],
})
export class InventoryPnModule {}
