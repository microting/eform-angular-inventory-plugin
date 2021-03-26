import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { SiteNameDto, FolderDto } from 'src/app/common/models';
import { AuthService, FoldersService } from 'src/app/common/services';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subscription } from 'rxjs';

@AutoUnsubscribe()
@Component({
  selector: 'app-inventory-folders-modal',
  templateUrl: './inventory-folders-modal.component.html',
  styleUrls: ['./inventory-folders-modal.component.scss'],
})
export class InventoryFoldersModalComponent implements OnInit, OnDestroy {
  @ViewChild('frame', { static: true }) frame;
  @Output()
  folderSelected: EventEmitter<FolderDto> = new EventEmitter<FolderDto>();
  sitesDto: Array<SiteNameDto> = [];
  @Input() folders: FolderDto[] = [];
  getAllFolders$: Subscription;
  selectedFolderId: number;

  get userClaims() {
    return this.authService.userClaims;
  }

  constructor(
    private folderService: FoldersService,
    private authService: AuthService
  ) {}

  ngOnInit() {}

  show(selectedFolderId?: number) {
    this.selectedFolderId = selectedFolderId;
    this.frame.show();
  }

  select(folder: FolderDto) {
    this.folderSelected.emit(folder);
    this.frame.hide();
  }

  ngOnDestroy(): void {}
}
