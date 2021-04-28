import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FolderDto, SiteNameDto } from 'src/app/common/models';
import { FoldersService } from 'src/app/common/services';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { AuthStateService } from 'src/app/common/store';

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
  selectedFolderId: number;

  get userClaims() {
    return this.authStateService.currentUserClaims;
  }

  constructor(
    private folderService: FoldersService,
    private authStateService: AuthStateService
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
