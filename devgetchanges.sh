#!/bin/bash

cd ~

rm -fR Documents/workspace/microting/eform-angular-inventory-plugin/eform-client/src/app/plugins/modules/inventory-pn

cp -a Documents/workspace/microting/eform-angular-frontend/eform-client/src/app/plugins/modules/inventory-pn Documents/workspace/microting/eform-angular-inventory-plugin/eform-client/src/app/plugins/modules/inventory-pn

rm -fR Documents/workspace/microting/eform-angular-inventory-plugin/eFormAPI/Plugins/Inventory.Pn

cp -a Documents/workspace/microting/eform-angular-frontend/eFormAPI/Plugins/Inventory.Pn Documents/workspace/microting/eform-angular-inventory-plugin/eFormAPI/Plugins/Inventory.Pn

# Test files rm
rm -fR Documents/workspace/microting/eform-angular-inventory-plugin/eform-client/e2e/Tests/inventory-settings/
rm -fR Documents/workspace/microting/eform-angular-inventory-plugin/eform-client/e2e/Tests/inventory-general/
rm -fR Documents/workspace/microting/eform-angular-inventory-plugin/eform-client/wdio-headless-plugin-step2.conf.js
rm -fR Documents/workspace/microting/eform-angular-inventory-plugin/eform-client/e2e/Page\ objects/Inventory

# Test files cp
cp -a Documents/workspace/microting/eform-angular-frontend/eform-client/e2e/Tests/inventory-settings Documents/workspace/microting/eform-angular-inventory-plugin/eform-client/e2e/Tests/inventory-settings
cp -a Documents/workspace/microting/eform-angular-frontend/eform-client/e2e/Tests/inventory-general Documents/workspace/microting/eform-angular-inventory-plugin/eform-client/e2e/Tests/inventory-general
cp -a Documents/workspace/microting/eform-angular-frontend/eform-client/wdio-plugin-step2.conf.js Documents/workspace/microting/eform-angular-inventory-plugin/eform-client/wdio-headless-plugin-step2.conf.js
cp -a Documents/workspace/microting/eform-angular-frontend/eform-client/e2e/Page\ objects/Inventory Documents/workspace/microting/eform-angular-inventory-plugin/eform-client/e2e/Page\ objects/Inventory
