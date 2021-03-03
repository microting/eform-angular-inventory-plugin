import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EformSharedTagsModule} from 'src/app/common/modules/eform-shared-tags/eform-shared-tags.module';
import {
  InventoryFoldersModalComponent,
  InventorySettingsComponent,
  InventorySiteAddModalComponent,
  InventorySiteRemoveModalComponent,
  ItemCreateContainerComponent,
  ItemCreateFormComponent,
  ItemDeleteModalComponent,
  ItemEditContainerComponent,
  ItemEditFormComponent,
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
import {
  InventoryPnItemGroupsService,
  InventoryPnItemGroupTagsService,
  InventoryPnItemsService,
  InventoryPnItemTypesService,
  InventoryPnSettingsService,
} from './services';
import {
  ButtonsModule,
  InputsModule,
  ModalModule,
  TableModule,
  TooltipModule, WavesModule,
} from 'angular-bootstrap-md';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { EformSharedModule } from 'src/app/common/modules/eform-shared/eform-shared.module';
import { SharedPnModule } from 'src/app/plugins/modules/shared/shared-pn.module';
import { InventoryPnLayoutComponent } from './layouts';

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
    ItemCreateContainerComponent,
    ItemCreateFormComponent,
    ItemEditContainerComponent,
    ItemEditFormComponent,
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
  ],
  providers: [
    InventoryPnItemsService,
    InventoryPnSettingsService,
    InventoryPnItemGroupsService,
    InventoryPnItemTypesService,
    InventoryPnItemGroupTagsService,
  ],
})
export class InventoryPnModule {}
