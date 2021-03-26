import { AfterViewInit, Component, OnInit } from '@angular/core';
import { LocaleService } from 'src/app/common/services';
import { TranslateService } from '@ngx-translate/core';
import { InventoryPnLocalSettings } from '../enums';
import { SharedPnService } from '../../shared/services';

declare var require: any;

@Component({
  selector: 'app-inventory-pn-layout',
  template: ` <router-outlet></router-outlet>`,
})
export class InventoryPnLayoutComponent implements AfterViewInit, OnInit {
  constructor(
    private localeService: LocaleService,
    private translateService: TranslateService,
    private sharedPnService: SharedPnService
  ) {}

  ngOnInit() {
    this.sharedPnService.initLocalPageSettings(
      'inventoryPnSettings',
      InventoryPnLocalSettings
    );
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const lang = this.localeService.getCurrentUserLocale();
      const i18n = require(`../i18n/${lang}.json`);
      this.translateService.setTranslation(lang, i18n, true);
    }, 1000);
  }
}
