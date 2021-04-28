import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  OperationDataResult,
  OperationResult,
} from 'src/app/common/models/operation.models';
import { InventoryPnSettingsModel } from '../models';
import { ApiBaseService } from 'src/app/common/services';

export let InventoryPnSettingsMethods = {
  Settings: 'api/inventory-pn/settings',
  SettingsSites: 'api/inventory-pn/settings/sites',
  SettingsFolder: 'api/inventory-pn/settings/folder',
};

@Injectable()
export class InventoryPnSettingsService {
  constructor(private apiBaseService: ApiBaseService) {}

  getAllSettings(): Observable<OperationDataResult<InventoryPnSettingsModel>> {
    return this.apiBaseService.get(InventoryPnSettingsMethods.Settings);
  }

  addSiteToSettings(siteId: number): Observable<OperationResult> {
    return this.apiBaseService.post(
      InventoryPnSettingsMethods.SettingsSites,
      siteId
    );
  }

  removeSiteFromSettings(id: number): Observable<OperationResult> {
    return this.apiBaseService.delete(
      InventoryPnSettingsMethods.SettingsSites + '/' + id
    );
  }

  updateSettingsFolder(folderId: number): Observable<OperationResult> {
    return this.apiBaseService.post(
      InventoryPnSettingsMethods.SettingsFolder,
      folderId
    );
  }
}
