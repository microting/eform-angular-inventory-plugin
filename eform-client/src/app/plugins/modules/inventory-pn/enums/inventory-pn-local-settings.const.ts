import {
  ApplicationPageModel,
  PageSettingsModel
} from 'src/app/common/models/settings';

export const InventoryPnLocalSettings = [
  new ApplicationPageModel({
      name: 'Items',
      settings: new PageSettingsModel({
        pageSize: 10,
        sort: 'Id',
        isSortDsc: false
      })
    },
  ),
  new ApplicationPageModel({
      name: 'ItemGroups',
      settings: new PageSettingsModel({
        pageSize: 10,
        sort: 'Id',
        isSortDsc: false
      })
    },
  ),
  new ApplicationPageModel({
      name: 'ItemTypes',
      settings: new PageSettingsModel({
        pageSize: 10,
        sort: 'Id',
        isSortDsc: false
      })
    },
  )
];

