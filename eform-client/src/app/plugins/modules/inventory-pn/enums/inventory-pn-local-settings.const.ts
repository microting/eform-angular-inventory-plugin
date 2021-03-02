import {
  ApplicationPageModel,
  PageSettingsModel
} from 'src/app/common/models/settings';

export const InventoryPnLocalSettings = [
  new ApplicationPageModel({
      name: 'InventoryItems',
      settings: new PageSettingsModel({
        pageSize: 10,
        sort: 'Id',
        isSortDsc: false
      })
    },
  )
];

