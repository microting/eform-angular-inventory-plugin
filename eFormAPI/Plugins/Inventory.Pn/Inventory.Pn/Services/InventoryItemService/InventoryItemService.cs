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

namespace Inventory.Pn.Services.InventoryItemService
{
    using System;
    using System.Diagnostics;
    using System.Linq;
    using System.Threading.Tasks;
    using Infrastructure.Models.Item;
    using Infrastructure.Models.Settings;
    using InventoryLocalizationService;
    using Microsoft.EntityFrameworkCore;
    using Microting.eForm.Infrastructure.Constants;
    using Microting.eForm.Infrastructure.Models;
    using Microting.eFormApi.BasePn.Abstractions;
    using Microting.eFormApi.BasePn.Infrastructure.Extensions;
    using Microting.eFormApi.BasePn.Infrastructure.Helpers.PluginDbOptions;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using Microting.eFormApi.BasePn.Infrastructure.Models.Common;
    using Microting.eFormInventoryBase.Infrastructure.Data;
    using Microting.eFormInventoryBase.Infrastructure.Data.Entities;

    public class InventoryItemService : IInventoryItemService
    {
        private readonly InventoryPnDbContext _dbContext;
        private readonly IInventoryLocalizationService _inventoryLocalizationService;
        private readonly IUserService _userService;
        private readonly IEFormCoreService _coreService;
        private readonly IPluginDbOptions<InventoryBaseSettings> _options;

        public InventoryItemService(
            InventoryPnDbContext dbContext,
            IInventoryLocalizationService inventoryLocalizationService,
            IUserService userService,
            IEFormCoreService coreService,
            IPluginDbOptions<InventoryBaseSettings> options)
        {
            _userService = userService;
            _inventoryLocalizationService = inventoryLocalizationService;
            _coreService = coreService;
            _dbContext = dbContext;
            _options = options;
        }

        public async Task<OperationDataResult<Paged<ItemModel>>> GetItems(ItemRequestModel itemRequest)
        {
            try
            {
                var inventoryItemQuery = _dbContext.Items
                    .AsQueryable();

                inventoryItemQuery = inventoryItemQuery
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed);

                // filter by name
                if (!string.IsNullOrEmpty(itemRequest.SnFilter))
                {
                    inventoryItemQuery = inventoryItemQuery
                        .Where(x => x.SN.Contains(itemRequest.SnFilter));
                }

                // filter by item group
                if (itemRequest.ItemGroupId.HasValue)
                {
                    inventoryItemQuery = inventoryItemQuery
                        .Where(x => x.ItemType.ItemGroupId == itemRequest.ItemGroupId);
                }

                // calculate total before pagination
                var total = await inventoryItemQuery.Select(x => x.Id).CountAsync();

                // pagination
                inventoryItemQuery
                    = inventoryItemQuery
                        .Skip(itemRequest.Offset)
                        .Take(itemRequest.PageSize);

                // add select
                var inventoryItemQueryWithSelect = AddSelectToItemQuery(inventoryItemQuery);


                // sort
                if (!string.IsNullOrEmpty(itemRequest.Sort))
                {
                    if (itemRequest.IsSortDsc)
                    {
                        if (itemRequest.Sort == "ItemType")
                        {
                            inventoryItemQueryWithSelect = inventoryItemQueryWithSelect
                                .OrderByDescending(x => x.ItemType.Name);
                        }
                        else if (itemRequest.Sort == "ItemGroup")
                        {
                            inventoryItemQueryWithSelect = inventoryItemQueryWithSelect
                                .OrderByDescending(x => x.ItemGroup.Name);
                        }
                        else
                        {
                            inventoryItemQueryWithSelect = inventoryItemQueryWithSelect
                                .CustomOrderByDescending(itemRequest.Sort);
                        }
                    }
                    else
                    {
                        if (itemRequest.Sort == "ItemType")
                        {
                            inventoryItemQueryWithSelect = inventoryItemQueryWithSelect
                                .OrderBy(x => x.ItemType.Name);
                        }
                        else if (itemRequest.Sort == "ItemGroup")
                        {
                            inventoryItemQueryWithSelect = inventoryItemQueryWithSelect
                                .OrderBy(x => x.ItemGroup.Name);
                        }
                        else
                        {
                            inventoryItemQueryWithSelect = inventoryItemQueryWithSelect
                                .CustomOrderBy(itemRequest.Sort);
                        }
                    }
                }
                else
                {
                    inventoryItemQueryWithSelect = inventoryItemQueryWithSelect
                        .OrderBy(x => x.Id);
                }

                // take objects from db
                var inventoryItemsFromDb = await inventoryItemQueryWithSelect.ToListAsync();

                var returnValue = new Paged<ItemModel>
                {
                    Entities = inventoryItemsFromDb,
                    Total = total,
                };

                return new OperationDataResult<Paged<ItemModel>>(true, returnValue);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                return new OperationDataResult<Paged<ItemModel>>(false,
                    _inventoryLocalizationService.GetString("ErrorObtainingItems"));
            }
        }

        //public async Task<OperationDataResult<ItemModel>> GetItemById(int itemId)
        //{
        //    try
        //    {
        //        var itemQuery = _dbContext.Items
        //            .Where(x => x.Id == itemId)
        //            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
        //            .AsQueryable();

        //        var item = await AddSelectToItemQuery(itemQuery)
        //            .FirstOrDefaultAsync();

        //        if (item == null)
        //        {
        //            return new OperationDataResult<ItemModel>(false,
        //                _inventoryLocalizationService.GetString("ItemNotFound"));
        //        }

        //        return new OperationDataResult<ItemModel>(true, item);
        //    }
        //    catch (Exception e)
        //    {
        //        Trace.TraceError(e.Message);
        //        return new OperationDataResult<ItemModel>(false,
        //            _inventoryLocalizationService.GetString("ErrorWhileGetItems"));
        //    }

        //}

        public async Task<OperationResult> UpdateItem(ItemUpdateModel itemUpdateModel)
        {
            try
            {
                var item = await _dbContext.Items
                    .Where(x => x.Id == itemUpdateModel.Id)
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .FirstOrDefaultAsync();

                if (item == null)
                {
                    return new OperationResult(false,
                        _inventoryLocalizationService.GetString("ItemNotFound"));
                }

                var option = _options.Value;

                if (option.InventoryFormId > 0 && option.FolderId > 0)
                {
                    var theCore = await _coreService.GetCore();
                    await using var sdkDbContext = theCore.DbContextHelper.GetDbContext();
                    var folder = sdkDbContext.Folders.Single(x => x.Id == option.FolderId);
                    // deploy cases
                    if (itemUpdateModel.Available && !item.Available)
                    {
                        foreach (var assignedSite in _dbContext.AssignedSites.Where(x =>
                            x.WorkflowState != Constants.WorkflowStates.Removed))
                        {

                            var siteLanguageId = await sdkDbContext.Sites
                                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                                .Where(x => x.MicrotingUid == assignedSite.SiteUid)
                                .Select(x => x.LanguageId)
                                .SingleAsync();

                            var language = await sdkDbContext.Languages.SingleAsync(x => x.Id == siteLanguageId);

                            var mainElement = await theCore.ReadeForm(option.InventoryFormId, language);

                            mainElement.CheckListFolderName = folder.Name;
                            mainElement.EndDate = DateTime.UtcNow.AddYears(10);
                            mainElement.Repeated = 0;
                            mainElement.PushMessageTitle = mainElement.Label;

                            // ReSharper disable once PossibleInvalidOperationException
                            await theCore.CaseCreate(mainElement, "", assignedSite.SiteUid, (int)folder.MicrotingUid);
                        }
                    }

                    // retract cases
                    if (item.Available && !itemUpdateModel.Available)
                    {

                        foreach (var assignedSite in _dbContext.AssignedSites.Where(x =>
                            x.WorkflowState != Constants.WorkflowStates.Removed))
                        {
                            var siteLanguageId = await sdkDbContext.Sites
                                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                                .Where(x => x.MicrotingUid == assignedSite.SiteUid)
                                .Select(x => x.LanguageId)
                                .SingleAsync();

                            var language = await sdkDbContext.Languages.SingleAsync(x => x.Id == siteLanguageId);
                            var mainElement = await theCore.ReadeForm(option.InventoryFormId, language);

                            if (mainElement.MicrotingUId != null)
                            {
                                await theCore.CaseDelete((int)mainElement.MicrotingUId, assignedSite.SiteUid);
                            }
                        }
                    }
                }
                item.SN = itemUpdateModel.SN;
                item.Available = itemUpdateModel.Available;
                item.CustomerId = itemUpdateModel.CustomerId;
                item.ExpirationDate = itemUpdateModel.ExpirationDate;
                item.ItemTypeId = itemUpdateModel.ItemTypeId;
                item.Location = itemUpdateModel.Location;
                item.UpdatedByUserId = _userService.UserId;

                await item.Update(_dbContext);

                return new OperationResult(true,
                    _inventoryLocalizationService.GetString("ItemUpdatedSuccessfully"));
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                return new OperationResult(false,
                    _inventoryLocalizationService.GetString("ErrorWhileUpdateItem"));
            }
        }

        public async Task<OperationResult> CreateItem(ItemCreateModel createItemModel)
        {
            try
            {
                var item = new Item
                {
                    Available = createItemModel.Available,
                    CustomerId = createItemModel.CustomerId,
                    CreatedByUserId = _userService.UserId,
                    UpdatedByUserId = _userService.UserId,
                    ExpirationDate = createItemModel.ExpirationDate,
                    ItemTypeId = createItemModel.ItemTypeId,
                    Location = createItemModel.Location,
                    SN = createItemModel.SN,
                };
                await item.Create(_dbContext);

                var option = _options.Value;

                if (option.InventoryFormId > 0 && option.FolderId > 0)
                {
                    var theCore = await _coreService.GetCore();
                    await using var sdkDbContext = theCore.DbContextHelper.GetDbContext();
                    var folder = sdkDbContext.Folders.Single(x => x.Id == option.FolderId);
                    if (item.Available)
                    {
                        foreach (var assignedSite in _dbContext.AssignedSites.Where(x =>
                            x.WorkflowState != Constants.WorkflowStates.Removed))
                        {
                            var siteLanguageId = await sdkDbContext.Sites
                                .Where(x => x.MicrotingUid == assignedSite.SiteUid)
                                .Select(x => x.LanguageId)
                                .SingleAsync();

                            var language = await sdkDbContext.Languages.SingleAsync(x => x.Id == siteLanguageId);
                            var mainElement = await theCore.ReadeForm(option.InventoryFormId, language);

                            mainElement.CheckListFolderName = folder.Name;
                            mainElement.EndDate = DateTime.UtcNow.AddYears(10);
                            mainElement.Repeated = 0;
                            mainElement.PushMessageTitle = mainElement.Label;

                            // ReSharper disable once PossibleInvalidOperationException
                            await theCore.CaseCreate(mainElement, "", assignedSite.SiteUid, (int)folder.MicrotingUid);
                        }
                    }
                }

                return new OperationResult(true,
                    _inventoryLocalizationService.GetString("ItemCreatedSuccessfully"));
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                return new OperationResult(false,
                    _inventoryLocalizationService.GetString("ErrorWhileCreatingItem"));
            }
        }

        public async Task<OperationResult> DeleteItemById(int itemId)
        {
            try
            {
                var item = await _dbContext.Items
                    .Where(x => x.Id == itemId)
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .FirstOrDefaultAsync();

                if (item == null)
                {
                    return new OperationResult(false,
                        _inventoryLocalizationService.GetString("ItemNotFound"));
                }

                item.UpdatedByUserId = _userService.UserId;
                await item.Delete(_dbContext);

                return new OperationResult(true,
                    _inventoryLocalizationService.GetString("ItemDeletedSuccessfully"));
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                return new OperationResult(false,
                    _inventoryLocalizationService.GetString("ErrorWhileDeleteItem"));
            }
        }

        private static IQueryable<ItemModel> AddSelectToItemQuery(IQueryable<Item> inventoryItemQuery)
        {
            return inventoryItemQuery.Select(x => new ItemModel
            {
                Available = x.Available,
                CustomerId = x.CustomerId,
                ExpirationDate = x.ExpirationDate,
                Id = x.Id,
                SN = x.SN,
                Location = x.Location,
                ItemType = new CommonDictionaryModel
                {
                    Name = x.ItemType.Name,
                    Id = x.ItemType.Id
                },
                ItemGroup = new CommonDictionaryModel()
                {
                    Id = x.ItemType.ItemGroup.Id,
                    Name = x.ItemType.ItemGroup.Name,
                    Description = x.ItemType.ItemGroup.Description,
                },
            });
        }

    }
}