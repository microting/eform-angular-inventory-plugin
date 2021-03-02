import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard, AuthGuard, PermissionGuard } from 'src/app/common/guards';
import { InventoryPnLayoutComponent } from './layouts';
import { InventoryPnClaims } from './enums';
import {InventorySettingsComponent} from './components';

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
        canActivate: [PermissionGuard],
        data: {
          requiredPermission: InventoryPnClaims.getInventoryItems,
        },
        // component: PlanningsContainerComponent,
      },
      {
        path: 'settings',
        canActivate: [AuthGuard],
        component: InventorySettingsComponent
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryPnRouting {}
