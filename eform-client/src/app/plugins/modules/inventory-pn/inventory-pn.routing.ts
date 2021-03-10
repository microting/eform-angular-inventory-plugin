import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, PermissionGuard } from 'src/app/common/guards';
import {
  InventorySettingsComponent,
  ItemGroupsContainerComponent,
  ItemsContainerComponent,
  ItemTypeCreateContainerComponent,
  ItemTypeEditContainerComponent,
  ItemTypesContainerComponent,
} from './components';
import { InventoryPnClaims } from './enums';
import { InventoryPnLayoutComponent } from './layouts';

export const routes: Routes = [
  {
    path: '',
    component: InventoryPnLayoutComponent,
    canActivate: [PermissionGuard],
    data: {
      requiredPermission: InventoryPnClaims.accessInventoryPlugin,
    },
    children: [
      {
        path: 'items',
        component: ItemsContainerComponent,
      },
      {
        path: 'items/:itemGroupId',
        component: ItemsContainerComponent,
      },
      {
        path: 'item-groups',
        component: ItemGroupsContainerComponent,
      },
      {
        path: 'item-types',
        component: ItemTypesContainerComponent,
      },
      {
        path: 'item-types/edit/:id',
        component: ItemTypeEditContainerComponent,
      },
      {
        path: 'item-types/create',
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
