import {SiteNameDto} from 'src/app/common/models';

export class InventoryPnSettingsModel {
  folderId?: number;
  folderName: string;
  assignedSites: SiteNameDto[] = [];
}
