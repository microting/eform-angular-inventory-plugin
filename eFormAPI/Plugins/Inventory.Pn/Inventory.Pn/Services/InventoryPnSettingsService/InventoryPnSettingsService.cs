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
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Logging;
    using Microting.eForm.Dto;
    using Microting.eFormApi.BasePn.Abstractions;
    using Microting.eFormApi.BasePn.Infrastructure.Helpers.PluginDbOptions;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using Microting.eFormInventoryBase.Infrastructure.Data;
    using Rebus.Bus;
    using RebusService;
    using System;
    using System.Collections.Generic;
    using System.Diagnostics;
    using System.Linq;
    using System.Threading.Tasks;
    using Microting.eForm.Infrastructure.Constants;
    using Microting.eFormInventoryBase.Infrastructure.Data.Entities;

    public class InventoryPnSettingsService : IInventoryPnSettingsService
    {
        private readonly ILogger<InventoryPnSettingsService> _logger;
        private readonly IInventoryLocalizationService _inventoryLocalizationService;
        private readonly InventoryPnDbContext _dbContext;
        private readonly IPluginDbOptions<InventoryBaseSettings> _options;
        private readonly IUserService _userService;
        private readonly IEFormCoreService _coreService;
        //private readonly IBus _bus;


        public InventoryPnSettingsService(ILogger<InventoryPnSettingsService> logger,
            IInventoryLocalizationService inventoryLocalizationService,
            InventoryPnDbContext dbContext,
            IPluginDbOptions<InventoryBaseSettings> options,
            IUserService userService,
            IEFormCoreService coreService/*,
            IRebusService rebusService*/)
        {
            _logger = logger;
            _dbContext = dbContext;
            _options = options;
            _userService = userService;
            _inventoryLocalizationService = inventoryLocalizationService;
            _coreService = coreService;
            //_bus = rebusService.GetBus();
        }

        public async Task<OperationDataResult<InventorySettingsModel>> GetSettings()
        {
            var sdkCore =
                await _coreService.GetCore();
            await using var sdkDbContext = sdkCore.DbContextHelper.GetDbContext();
            try
            {
                var option = _options.Value;

                var siteIds = _dbContext.AssignedSites
                    .AsNoTracking()
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .Select(site => site.SiteUid)
                    .ToList();

                var assignetSites = sdkDbContext.Sites
                    .AsNoTracking()
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .Where(x => siteIds.Contains((int)x.MicrotingUid))
                    .Select(x => new SiteNameDto((int)x.MicrotingUid, x.Name, x.CreatedAt, x.UpdatedAt))
                    .ToList();

                var settings = new InventorySettingsModel
                {
                    AssignedSites = assignetSites,
                    FolderId = option.FolderId,
                };

                return new OperationDataResult<InventorySettingsModel>(true, settings);
            }
            catch (Exception e)
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
            try
            {
                if (await sdkDbContext.Sites.AnyAsync(x => x.MicrotingUid == siteId))
                {
                    var assignedSite = new AssignedSite
                    {
                        SiteUid = siteId,
                        UpdatedByUserId = _userService.UserId,
                        CreatedByUserId = _userService.UserId,
                    };

                    await assignedSite.Create(_dbContext);

                    return new OperationResult(true,
                        _inventoryLocalizationService.GetString("SettingsHaveBeenUpdatedSuccessfully"));
                }

                throw new ArgumentException($"Site with Uid = {siteId} doesn't exist");
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
                var assingnedSite = await _dbContext.AssignedSites
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .Where(x => x.SiteUid == siteId)
                    .FirstOrDefaultAsync();
                if (assingnedSite != null)
                {
                    await assingnedSite.Delete(_dbContext);
                }
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
        public async Task<OperationResult> UpdateFolderIdAsync(int folderId)
        {
            try
            {
                if (folderId > 0)
                {
                    await _options.UpdateDb(settings =>
                        {
                            settings.FolderId = folderId;
                        },
                        _dbContext,
                        _userService.UserId);

                    return new OperationResult(
                        true,
                        _inventoryLocalizationService.GetString("SettingsHaveBeenUpdatedSuccessfully"));
                }

                throw new ArgumentException($"{nameof(folderId)} is 0");
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