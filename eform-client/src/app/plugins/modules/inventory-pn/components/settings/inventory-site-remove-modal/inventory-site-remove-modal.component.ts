import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { SiteNameDto } from 'src/app/common/models';
import { InventoryPnSettingsService } from '../../../services';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subscription } from 'rxjs';

@AutoUnsubscribe()
@Component({
  selector: 'app-inventory-site-remove-modal',
  templateUrl: './inventory-site-remove-modal.component.html',
  styleUrls: ['./inventory-site-remove-modal.component.scss'],
})
export class InventorySiteRemoveModalComponent implements OnInit, OnDestroy {
  @ViewChild('frame', { static: false }) frame;
  @Output() siteRemoved: EventEmitter<void> = new EventEmitter<void>();
  selectedSite: SiteNameDto = new SiteNameDto();
  removeSub$: Subscription;

  constructor(private settingsService: InventoryPnSettingsService) {}

  ngOnInit(): void {}

  show(site: SiteNameDto) {
    this.selectedSite = site;
    this.frame.show();
  }

  removeSite() {
    this.removeSub$ = this.settingsService
      .removeSiteFromSettings(this.selectedSite.siteUId)
      .subscribe((data) => {
        this.siteRemoved.emit();
        this.frame.hide();
        this.selectedSite = new SiteNameDto();
      });
  }

  ngOnDestroy() {}
}
