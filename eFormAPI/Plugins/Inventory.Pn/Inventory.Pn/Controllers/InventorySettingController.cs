﻿/*
The MIT License (MIT)
Copyright (c) 2007 - 2021 Microting A/S
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

namespace Inventory.Pn.Controllers
{
    using Infrastructure.Models.Settings;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using Services.InventoryPnSettingsService;
    using System.Threading.Tasks;

    public class InventorySettingController : Controller
    {

        private readonly IInventoryPnSettingsService _inventoryPnSettingsService;

        public InventorySettingController(IInventoryPnSettingsService inventoryPnSettingsService)
        {
            _inventoryPnSettingsService = inventoryPnSettingsService;
        }

        [HttpGet]
        [Authorize(Roles = EformRole.Admin)]
        [Route("api/inventory-pn/settings")]
        public async Task<OperationDataResult<InventorySettingsModel>> GetSettings()
        {
            return await _inventoryPnSettingsService.GetSettings();
        }

        [HttpPost]
        [Authorize(Roles = EformRole.Admin)]
        [Route("api/inventory-pn/settings/sites")]
        public async Task<OperationResult> AddSites([FromBody] int siteId)
        {
            return await _inventoryPnSettingsService.AddSiteToSettingsAsync(siteId);
        }

        [HttpDelete]
        [Authorize(Roles = EformRole.Admin)]
        [Route("api/inventory-pn/settings/sites/{siteId}")]
        public async Task<OperationResult> RemoveSites(int siteId)
        {
            return await _inventoryPnSettingsService.RemoveSiteFromSettingsAsync(siteId);
        }

        [HttpPost]
        [Authorize(Roles = EformRole.Admin)]
        [Route("api/inventory-pn/settings/folder")]
        public async Task<OperationResult> UpdateFolderId([FromBody] int folderIfId)
        {
            return await _inventoryPnSettingsService.UpdateFolderIdAsync(folderIfId);
        }
    }
}