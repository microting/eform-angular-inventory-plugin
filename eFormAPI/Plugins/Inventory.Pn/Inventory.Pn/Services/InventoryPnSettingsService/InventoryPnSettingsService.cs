/*
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

namespace Inventory.Pn.Services.InventoryPnSettingsService
{
    using Infrastructure.Models.Settings;
    using InventoryLocalizationService;
    using Microsoft.Extensions.Logging;
    using Microting.eFormApi.BasePn.Abstractions;
    using Microting.eFormApi.BasePn.Infrastructure.Helpers.PluginDbOptions;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using Microting.eFormInventoryBase.Infrastructure.Data;
    using System;
    using System.Collections.Generic;
    using System.Diagnostics;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.EntityFrameworkCore;
    using Microting.eForm.Dto;
    using Microting.eForm.Infrastructure.Constants;
    using Microting.eForm.Infrastructure.Data.Entities;
    using Microting.eForm.Infrastructure.Models;
    using Rebus.Bus;
    using RebusService;

    public class InventoryPnSettingsService : IInventoryPnSettingsService
    {
        private readonly ILogger<InventoryPnSettingsService> _logger;
        private readonly IInventoryLocalizationService _inventoryLocalizationService;
        private readonly InventoryPnDbContext _dbContext;
        private readonly IPluginDbOptions<InventoryBaseSettings> _options;
        private readonly IUserService _userService;
        private readonly IEFormCoreService _coreService;
        private readonly IBus _bus;


        public InventoryPnSettingsService(ILogger<InventoryPnSettingsService> logger,
            IInventoryLocalizationService inventoryLocalizationService,
            InventoryPnDbContext dbContext,
            IPluginDbOptions<InventoryBaseSettings> options,
            IUserService userService,
            IEFormCoreService coreService,
            IRebusService rebusService)
        {
            _logger = logger;
            _dbContext = dbContext;
            _options = options;
            _userService = userService;
            _inventoryLocalizationService = inventoryLocalizationService;
            _coreService = coreService;
            _bus = rebusService.GetBus();
        }

        public async Task<OperationDataResult<InventorySettingsModel>> GetSettings()
        {
            var sdkCore =
                await _coreService.GetCore();
            await using var sdkDbContext = sdkCore.DbContextHelper.GetDbContext();
            try
            {
                var option = _options.Value;

                var settings = new InventorySettingsModel
                {
                    AssignedSites = option.AssignedSites,
                    FolderId = option.FolderId,
                };

                return new OperationDataResult<InventorySettingsModel>(true, settings);
            }
            catch(Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationDataResult<InventorySettingsModel>(false,
                    _inventoryLocalizationService.GetString("ErrorWhileObtainingInventorySettings"));
            }
        }

        public async Task<OperationResult> AddSiteToSettingsAsync(int siteId)
        {
            var theCore = await _coreService.GetCore();
            await using var sdkDbContext = theCore.DbContextHelper.GetDbContext();
            var option = _options.Value;
            var site = await sdkDbContext.Sites.SingleAsync(x => x.MicrotingUid == siteId);

            try
            {
                var settings = new InventorySettingsModel
                {
                    AssignedSites = option.AssignedSites,
                };
                settings.AssignedSites.Add(new SiteNameDto((int) 
                        site.MicrotingUid,
                        site.Name,
                        site.CreatedAt,
                        site.UpdatedAt));
                await _options.UpdateDb(inventoryBaseSettings =>
                {
                    inventoryBaseSettings.AssignedSites = settings.AssignedSites;
                }, _dbContext, _userService.UserId);
                return new OperationResult(true, _inventoryLocalizationService.GetString("SettingsHaveBeenUpdatedSuccessfully"));
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationResult(false,
                    _inventoryLocalizationService.GetString("ErrorWhileUpdatingSettings"));
            }
        }


        public async Task<OperationResult> RemoveSiteFromSettingsAsync(int siteId)
        {
            try
            {
                var theCore = await _coreService.GetCore();
                await using var sdkDbContext = theCore.DbContextHelper.GetDbContext();
                var option = _options.Value;
                var assignedSite = option.AssignedSites.First(x => x.SiteUId == siteId);
                option.AssignedSites.Remove(assignedSite);

                await _options.UpdateDb(inventoryBaseSettings =>
                {
                    inventoryBaseSettings.AssignedSites = option.AssignedSites;
                }, _dbContext, _userService.UserId);

                return new OperationResult(true,
                    _inventoryLocalizationService.GetString("SettingsHaveBeenUpdatedSuccessfully"));
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationResult(false,
                    _inventoryLocalizationService.GetString("ErrorWhileUpdatingSettings"));
            }
        }
    }
}