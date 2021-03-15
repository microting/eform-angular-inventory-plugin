import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectModule } from '@ng-select/ng-select';
import {GalleryModule} from '@ngx-gallery/core';
import { TranslateModule } from '@ngx-translate/core';
import {
    ButtonsModule, CardsModule,
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
import { ItemTypeImagesComponent } from './components/item-types/item-type-actions/item-type-images/item-type-images.component';
import { ItemTypeImagesModalComponent } from './components/item-types/item-type-images-modal/item-type-images-modal.component';

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

    ItemTypeImagesComponent,

    ItemTypeImagesModalComponent,
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
    ReactiveFormsModule,
    CardsModule,
    GalleryModule,
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
