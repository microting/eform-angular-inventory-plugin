import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { InventoryPnSettingsModel } from '../../../models';
import { InventoryPnSettingsService } from '../../../services';
import { Subscription } from 'rxjs';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { InventorySiteRemoveModalComponent } from '../inventory-site-remove-modal/inventory-site-remove-modal.component';
import { InventorySiteAddModalComponent } from '../inventory-site-add-modal/inventory-site-add-modal.component';
import { InventoryFoldersModalComponent } from '../inventory-folders-modal/inventory-folders-modal.component';
import { FoldersService, SitesService } from 'src/app/common/services/advanced';
import { FolderDto, SiteNameDto } from 'src/app/common/models';
import { composeFolderName } from 'src/app/common/helpers';

@AutoUnsubscribe()
@Component({
  selector: 'app-inventory-pn-settings',
  templateUrl: './inventory-settings.component.html',
  styleUrls: ['./inventory-settings.component.scss'],
})
export class InventorySettingsComponent implements OnInit, OnDestroy {
  @ViewChild('siteRemoveModal')
  siteRemoveModal: InventorySiteRemoveModalComponent;
  @ViewChild('siteAddModal') siteAddModal: InventorySiteAddModalComponent;
  @ViewChild('foldersModal', { static: false })
  foldersModal: InventoryFoldersModalComponent;
  settingsModel: InventoryPnSettingsModel = new InventoryPnSettingsModel();
  sites: SiteNameDto[] = [];
  foldersTreeDto: FolderDto[] = [];
  foldersDto: FolderDto[] = [];
  settingsSub$: Subscription;
  sitesSub$: Subscription;
  foldersSubTree$: Subscription;
  foldersSub$: Subscription;
  folderUpdateSub$: Subscription;
  tasksFolder: boolean;

  // tslint:disable-next-line:max-line-length
  constructor(
    private settingsService: InventoryPnSettingsService,
    private sitesService: SitesService,
    private foldersService: FoldersService
  ) {}

  ngOnInit(): void {
    this.getSettings();
    this.loadAllFoldersTree();
    this.getSites();
  }

  getSettings() {
    this.settingsSub$ = this.settingsService
      .getAllSettings()
      .subscribe((data) => {
        if (data && data.success) {
          this.settingsModel = data.model;
          this.loadFlatFolders();
        }
      });
  }

  getSites() {
    this.sitesSub$ = this.sitesService.getAllSites().subscribe((data) => {
      if (data && data.success) {
        this.sites = data.model;
      }
    });
  }

  loadAllFoldersTree() {
    this.foldersSubTree$ = this.foldersService
      .getAllFolders()
      .subscribe((operation) => {
        if (operation && operation.success) {
          this.foldersTreeDto = operation.model;
        }
      });
  }

  loadFlatFolders() {
    this.foldersSub$ = this.foldersService
      .getAllFoldersList()
      .subscribe((operation) => {
        if (operation && operation.success) {
          this.foldersDto = operation.model;
          this.settingsModel.folderId === null
            ? (this.settingsModel.folderName = null)
            : (this.settingsModel.folderName = composeFolderName(
                this.settingsModel.folderId,
                this.foldersDto
              ));
        }
      });
  }

  showAddNewSiteModal() {
    this.siteAddModal.show(this.sites, this.settingsModel.assignedSites);
  }

  showRemoveSiteModal(selectedSite: SiteNameDto) {
    this.siteRemoveModal.show(selectedSite);
  }

  openFoldersModal() {
    this.tasksFolder = false;
    this.foldersModal.show(this.settingsModel.folderId);
  }

  // openTasksFoldersModal() {
  //   this.tasksFolder = true;
  //   this.foldersModal.show(this.settingsModel.folderTasksId);
  // }

  onFolderSelected(folderDto: FolderDto) {
    this.folderUpdateSub$ = this.settingsService
      .updateSettingsFolder(folderDto.id)
      .subscribe((operation) => {
        if (operation && operation.success) {
          this.getSettings();
        }
      });
  }

  ngOnDestroy(): void {}
}
