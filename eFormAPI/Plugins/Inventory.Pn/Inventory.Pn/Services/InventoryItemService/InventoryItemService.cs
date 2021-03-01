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
    using Infrastructure.Models.ItemType;
    using InventoryLocalizationService;
    using Microsoft.EntityFrameworkCore;
    using Microting.eForm.Infrastructure.Constants;
    using Microting.eFormApi.BasePn.Abstractions;
    using Microting.eFormApi.BasePn.Infrastructure.Extensions;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using Microting.eFormInventoryBase.Infrastructure.Data;
    using Microting.eFormInventoryBase.Infrastructure.Data.Entities;

    public class InventoryItemService: IInventoryItemService
    {
        private readonly InventoryPnDbContext _dbContext;
        private readonly IInventoryLocalizationService _inventoryLocalizationService;
        private readonly IUserService _userService;
        //private readonly IEFormCoreService _coreService;

        public InventoryItemService(
            InventoryPnDbContext dbContext,
            IInventoryLocalizationService inventoryLocalizationService,
            IUserService userService/*,
            IEFormCoreService coreService*/)
        {
            _userService = userService;
            _inventoryLocalizationService = inventoryLocalizationService;
            //_coreService = coreService;
            _dbContext = dbContext;
        }

        public async Task<OperationDataResult<ItemPnModel>> GetItems(ItemRequestModel itemRequest)
        {
            try
            {
                var inventoryItemQuery = _dbContext.Items
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .AsQueryable();

                // sort
                if (!string.IsNullOrEmpty(itemRequest.Sort))
                {
                    if (itemRequest.IsSortDsc)
                    {
                        inventoryItemQuery = inventoryItemQuery
                            .CustomOrderByDescending(itemRequest.Sort);
                    }
                    else
                    {
                        inventoryItemQuery = inventoryItemQuery
                            .CustomOrderBy(itemRequest.Sort);
                    }
                }
                else
                {
                    inventoryItemQuery = _dbContext.Items
                        .OrderBy(x => x.Id);
                }

                // filter by name
                if (!string.IsNullOrEmpty(itemRequest.SnFilter))
                {
                    inventoryItemQuery = inventoryItemQuery
                        .Where(x => x.SN == itemRequest.SnFilter);
                }


                // calculate total before pagination
                var total = inventoryItemQuery.Count();

                // pagination
                inventoryItemQuery
                    = inventoryItemQuery
                        .Skip(itemRequest.Offset)
                        .Take(itemRequest.PageSize);

                // add select and take objects from db
                var inventoryItemsFromDb = await AddSelectToItemQuery(inventoryItemQuery).ToListAsync();
                var returnValue = new ItemPnModel
                {
                    Items = inventoryItemsFromDb,
                    Total = total,
                };

                return new OperationDataResult<ItemPnModel>(true, returnValue);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                return new OperationDataResult<ItemPnModel>(false,
                    _inventoryLocalizationService.GetString("ErrorObtainingItems"));
            }
        }

        public async Task<OperationDataResult<ItemViewModel>> GetItemById(int itemId)
        {
            try
            {
                var itemQuery = _dbContext.Items
                    .Where(x => x.Id == itemId)
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .AsQueryable();

                var item = await AddSelectToItemQuery(itemQuery)
                    .FirstOrDefaultAsync();

                if (item == null)
                {
                    return new OperationDataResult<ItemViewModel>(false,
                        _inventoryLocalizationService.GetString("ItemGroupNotFound"));
                }

                return new OperationDataResult<ItemViewModel>(true, item);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                return new OperationDataResult<ItemViewModel>(false,
                    _inventoryLocalizationService.GetString("ErrorWhileGetItems"));
            }

        }

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

                item.SN = itemUpdateModel.SN;
                item.Aviable = itemUpdateModel.Aviable;
                item.CustomerId = itemUpdateModel.CustomerId;
                item.ExpirationDate = itemUpdateModel.ExpirationDate;
                item.ItemTypeId = itemUpdateModel.ItemTypeId;
                item.Location = itemUpdateModel.Location;
                item.UpdatedByUserId = _userService.UserId;

                await item.Update(_dbContext);

                return new OperationResult(true);
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
                    Aviable = createItemModel.Aviable,
                    CustomerId = createItemModel.CustomerId,
                    CreatedByUserId = _userService.UserId,
                    UpdatedByUserId = _userService.UserId,
                    ExpirationDate = createItemModel.ExpirationDate,
                    ItemTypeId = createItemModel.ItemTypeId,
                    Location = createItemModel.Location,
                    SN = createItemModel.SN,
                };
                await item.Create(_dbContext);
                return new OperationResult(true);
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

                return new OperationResult(true);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                return new OperationResult(false,
                    _inventoryLocalizationService.GetString("ErrorWhileDeleteItem"));
            }
        }

        private IQueryable<ItemViewModel> AddSelectToItemQuery(IQueryable<Item> inventoryItemQuery)
        {
            return inventoryItemQuery.Select(x => new ItemViewModel
            {
                Aviable = x.Aviable,
                CustomerId = (int) x.CustomerId,
                ExpirationDate = x.ExpirationDate,
                Id = x.Id,
                SN = x.SN,
                Location = x.Location,
                ItemType = _dbContext.ItemTypes
                    .Where(y => y.WorkflowState != Constants.WorkflowStates.Removed)
                    .Where(y => y.Id == x.ItemTypeId)
                    .Select(y => new ItemTypeViewModel
                    {
                        Name = y.Name,
                    })
                    .FirstOrDefault(),
            });
        }
    }
}