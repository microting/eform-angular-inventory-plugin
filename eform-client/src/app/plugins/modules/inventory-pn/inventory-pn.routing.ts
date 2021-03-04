import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, PermissionGuard } from 'src/app/common/guards';
import {
  InventorySettingsComponent, ItemCreateContainerComponent, ItemEditContainerComponent,
  ItemGroupsContainerComponent,
  ItemsContainerComponent, ItemTypeCreateContainerComponent, ItemTypeEditContainerComponent,
  ItemTypesContainerComponent,
} from './components';
import { InventoryPnClaims } from './enums';
import { InventoryPnLayoutComponent } from './layouts';

export const routes: Routes = [
  {
    path: '',
    component: InventoryPnLayoutComponent,
    // canActivate: [PermissionGuard],
    // data: {
    //   requiredPermission: InventoryPnClaims.accessInventoryPlugin,
    // },
    children: [
      {
        path: 'items',
        // canActivate: [PermissionGuard],
        // data: {
        //   requiredPermission: InventoryPnClaims.getInventoryItems,
        // },
        component: ItemsContainerComponent,
      },
      {
        path: 'item/edit/:id',
        canActivate: [PermissionGuard],
        component: ItemEditContainerComponent,
      },
      {
        path: 'item/create',
        canActivate: [PermissionGuard],
        component: ItemCreateContainerComponent,
      },
      {
        path: 'item-groups',
        canActivate: [PermissionGuard],
        component: ItemGroupsContainerComponent,
      },
      {
        path: 'item-types',
        canActivate: [PermissionGuard],
        component: ItemTypesContainerComponent,
      },
      {
        path: 'item-type/edit/:id',
        canActivate: [PermissionGuard],
        component: ItemTypeEditContainerComponent,
      },
      {
        path: 'item-type/create',
        canActivate: [PermissionGuard],
        component: ItemTypeCreateContainerComponent,
      },
      {
        path: 'settings',
        canActivate: [AuthGuard],
        component: InventorySettingsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryPnRouting {}
