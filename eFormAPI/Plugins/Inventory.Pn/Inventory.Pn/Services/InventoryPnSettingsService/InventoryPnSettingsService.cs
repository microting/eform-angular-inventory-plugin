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
    using System.Diagnostics;
    using System.Threading.Tasks;

    public class InventoryPnSettingsService : IInventoryPnSettingsService
    {
        private readonly ILogger<InventoryPnSettingsService> _logger;
        private readonly IInventoryLocalizationService _itemsPlanningLocalizationService;
        private readonly InventoryPnDbContext _dbContext;
        private readonly IPluginDbOptions<InventoryBaseSettings> _options;
        private readonly IUserService _userService;


        public InventoryPnSettingsService(ILogger<InventoryPnSettingsService> logger,
            IInventoryLocalizationService itemsPlanningLocalizationService,
            InventoryPnDbContext dbContext,
            IPluginDbOptions<InventoryBaseSettings> options,
            IUserService userService)
        {
            _logger = logger;
            _dbContext = dbContext;
            _options = options;
            _userService = userService;
            _itemsPlanningLocalizationService = itemsPlanningLocalizationService;
        }

        public Task<OperationDataResult<InventoryBaseSettings>> GetSettings()
        {
            try
            {
                var option = _options.Value;

                return Task.FromResult(new OperationDataResult<InventoryBaseSettings>(true, option));
            }
            catch(Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return Task.FromResult(new OperationDataResult<InventoryBaseSettings>(false,
                    _itemsPlanningLocalizationService.GetString("ErrorWhileObtainingInventorySettings")));
            }
        }

        public async Task<OperationResult> UpdateSettings(InventoryBaseSettings itemsPlanningBaseSettings)
        {
            try
            {
                await _options.UpdateDb(settings =>
                {
                    settings.StartTime = itemsPlanningBaseSettings.StartTime;
                    settings.EndTime = itemsPlanningBaseSettings.EndTime;
                    settings.ReportHeaderName = itemsPlanningBaseSettings.ReportHeaderName;
                    settings.ReportSubHeaderName = itemsPlanningBaseSettings.ReportSubHeaderName;
                    settings.ReportImageName = itemsPlanningBaseSettings.ReportImageName;
                }, _dbContext, _userService.UserId);

                return new OperationResult(true,
                    _itemsPlanningLocalizationService.GetString("SettingsHaveBeenUpdatedSuccessfully"));
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationResult(false,
                    _itemsPlanningLocalizationService.GetString("ErrorWhileUpdatingSettings"));
            }
        }
    }
}