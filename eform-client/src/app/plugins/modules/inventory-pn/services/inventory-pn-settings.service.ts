import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import {
  OperationDataResult,
  OperationResult,
} from 'src/app/common/models/operation.models';
import { BaseService } from 'src/app/common/services/base.service';
import { InventoryPnSettingsModel } from '../models';

export let InventoryPnSettingsMethods = {
  Settings: 'api/inventory-pn/settings',
  SettingsSites: 'api/inventory-pn/settings/sites',
  SettingsFolder: 'api/inventory-pn/settings/folder',
};

@Injectable()
export class InventoryPnSettingsService extends BaseService {
  constructor(
    private _http: HttpClient,
    router: Router,
    toastrService: ToastrService
  ) {
    super(_http, router, toastrService);
  }

  getAllSettings(): Observable<OperationDataResult<InventoryPnSettingsModel>> {
    return this.get(InventoryPnSettingsMethods.Settings);
  }

  addSiteToSettings(siteId: number): Observable<OperationResult> {
    return this.post(InventoryPnSettingsMethods.SettingsSites, siteId);
  }

  removeSiteFromSettings(id: number): Observable<OperationResult> {
    return this.delete(InventoryPnSettingsMethods.SettingsSites + '/' + id);
  }

  updateSettingsFolder(folderId: number): Observable<OperationResult> {
    return this.post(InventoryPnSettingsMethods.SettingsFolder, folderId);
  }
}
