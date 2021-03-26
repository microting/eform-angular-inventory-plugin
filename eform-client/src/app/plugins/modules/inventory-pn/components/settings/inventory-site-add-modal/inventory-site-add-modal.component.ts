import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { SiteNameDto } from 'src/app/common/models';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subscription } from 'rxjs';
import { InventoryPnSettingsService } from '../../../services';
import { eqBy, prop, symmetricDifferenceWith } from 'ramda';

@AutoUnsubscribe()
@Component({
  selector: 'app-inventory-site-add-modal',
  templateUrl: './inventory-site-add-modal.component.html',
  styleUrls: ['./inventory-site-add-modal.component.scss'],
})
export class InventorySiteAddModalComponent implements OnInit, OnDestroy {
  @ViewChild('frame', { static: false }) frame;
  @Output() siteAdded: EventEmitter<void> = new EventEmitter<void>();
  availableSites: SiteNameDto[] = [];
  selectedSiteId: number;
  addSiteSub$: Subscription;

  constructor(private settingsService: InventoryPnSettingsService) {}

  ngOnInit(): void {}

  show(sites: SiteNameDto[], assignedSites: SiteNameDto[]) {
    // Removing assigned sites from all sites by id
    const propEqual = eqBy(prop('siteUId'));
    this.availableSites = symmetricDifferenceWith(
      propEqual,
      sites,
      assignedSites
    );
    this.frame.show();
  }

  assignSite() {
    this.addSiteSub$ = this.settingsService
      .addSiteToSettings(this.selectedSiteId)
      .subscribe((data) => {
        if (data && data.success) {
          this.frame.hide();
          this.selectedSiteId = null;
          this.availableSites = [];
          this.siteAdded.emit();
        }
      });
  }

  ngOnDestroy(): void {}
}
