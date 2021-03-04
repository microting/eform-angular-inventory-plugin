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

namespace Inventory.Pn.Services.InventoryItemGroupService
{
    using System;
    using System.Collections.Generic;
    using System.Diagnostics;
    using System.Linq;
    using System.Threading.Tasks;
    using Infrastructure.Models.ItemGroup;
    using InventoryLocalizationService;
    using Microsoft.EntityFrameworkCore;
    using Microting.eForm.Infrastructure.Constants;
    using Microting.eFormApi.BasePn.Abstractions;
    using Microting.eFormApi.BasePn.Infrastructure.Extensions;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using Microting.eFormApi.BasePn.Infrastructure.Models.Common;
    using Microting.eFormInventoryBase.Infrastructure.Data;
    using Microting.eFormInventoryBase.Infrastructure.Data.Entities;

    public class InventoryItemGroupService: IInventoryItemGroupService
    {
        private readonly InventoryPnDbContext _dbContext;
        private readonly IInventoryLocalizationService _inventoryLocalizationService;
        private readonly IUserService _userService;
        //private readonly IEFormCoreService _coreService;

        public InventoryItemGroupService(
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


        public async Task<OperationDataResult<ItemGroupPnModel>> GetItemGroups(ItemGroupRequestModel itemGroupRequestModel)
        {
            try
            {
                var inventoryItemGroupQuery = _dbContext.ItemGroups
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .AsQueryable();

                // sort
                if (!string.IsNullOrEmpty(itemGroupRequestModel.Sort))
                {
                    if (itemGroupRequestModel.IsSortDsc)
                    {
                        inventoryItemGroupQuery = inventoryItemGroupQuery
                            .CustomOrderByDescending(itemGroupRequestModel.Sort);
                    }
                    else
                    {
                        inventoryItemGroupQuery = inventoryItemGroupQuery
                            .CustomOrderBy(itemGroupRequestModel.Sort);
                    }
                }
                else
                {
                    inventoryItemGroupQuery = _dbContext.ItemGroups
                        .OrderBy(x => x.Id);
                }

                // filter by name
                if (!string.IsNullOrEmpty(itemGroupRequestModel.NameFilter))
                {
                    inventoryItemGroupQuery = inventoryItemGroupQuery
                        .Where(x => x.Name == itemGroupRequestModel.NameFilter);
                }


                // calculate total before pagination
                var total = inventoryItemGroupQuery.Count();

                // pagination
                inventoryItemGroupQuery
                    = inventoryItemGroupQuery
                        .Skip(itemGroupRequestModel.Offset)
                        .Take(itemGroupRequestModel.PageSize);

                // add select and take objects from db
                var inventoryItemGroupsFromDb = await AddSelectToItemGroupQuery(inventoryItemGroupQuery).ToListAsync();
                var returnValue = new ItemGroupPnModel
                {
                    ItemGroups = inventoryItemGroupsFromDb,
                    Total = total,
                };

                return new OperationDataResult<ItemGroupPnModel>(true, returnValue);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                return new OperationDataResult<ItemGroupPnModel>(false,
                    _inventoryLocalizationService.GetString("ErrorObtainingItemGroups"));
            }
        }


        public async Task<OperationDataResult<ItemGroupModel>> GetItemGroupById(int itemGroupId)
        {
            try
            {
                var itemGroupQuery = _dbContext.ItemGroups
                    .Where(x => x.Id == itemGroupId)
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .AsQueryable();

                var itemGroup = await AddSelectToItemGroupQuery(itemGroupQuery)
                    .FirstOrDefaultAsync();

                if (itemGroup == null)
                {
                    return new OperationDataResult<ItemGroupModel>(false,
                        _inventoryLocalizationService.GetString("ItemGroupNotFound"));
                }

                return new OperationDataResult<ItemGroupModel>(true, itemGroup);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                return new OperationDataResult<ItemGroupModel>(false,
                    _inventoryLocalizationService.GetString("ErrorWhileGetItemGroup"));
            }
        }

        public async Task<OperationResult> UpdateItemGroup(ItemGroupUpdateModel model)
        {
            try
            {
                var itemGroup = await _dbContext.ItemGroups
                    .Where(x => x.Id == model.Id)
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .FirstOrDefaultAsync();

                if (itemGroup == null)
                {
                    return new OperationResult(false,
                        _inventoryLocalizationService.GetString("ItemGroupNotFound"));
                }

                itemGroup.Description = model.Description;
                itemGroup.Code = model.Code;
                itemGroup.Name = model.Name;
                itemGroup.ParentId = model.ParentId;
                itemGroup.UpdatedByUserId = _userService.UserId;

                await itemGroup.Update(_dbContext);

                return new OperationResult(true);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                return new OperationResult(false,
                    _inventoryLocalizationService.GetString("ErrorWhileUpdateItemGroup"));
            }
        }

        public async Task<OperationResult> CreateItemGroup(ItemGroupCreateModel itemGroupCreateModel)
        {
            try
            {
                var itemGroup = new ItemGroup
                {
                    Description = itemGroupCreateModel.Description,
                    ParentId = itemGroupCreateModel.ParentId,
                    CreatedByUserId = _userService.UserId,
                    UpdatedByUserId = _userService.UserId,
                    Name = itemGroupCreateModel.Name,
                    Code = itemGroupCreateModel.Code,
                };
                await itemGroup.Create(_dbContext);
                return new OperationResult(true);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                return new OperationResult(false,
                    _inventoryLocalizationService.GetString("ErrorWhileCreatingItemGroup"));
            }
        }

        public async Task<OperationResult> DeleteItemGroupById(int itemGroupId)
        {
            try
            {
                var itemGroup = await _dbContext.ItemGroups
                    .Where(x => x.Id == itemGroupId)
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .FirstOrDefaultAsync();

                if (itemGroup == null)
                {
                    return new OperationResult(false,
                        _inventoryLocalizationService.GetString("ItemGroupNotFound"));
                }

                var itemGroups = await _dbContext.ItemGroups
                    .Where(x => x.ParentId == itemGroup.Id)
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .ToListAsync();

                foreach (var itemGroupLocal in itemGroups)
                {
                    itemGroupLocal.ParentId = null;
                    itemGroupLocal.UpdatedByUserId = _userService.UserId;
                    await itemGroupLocal.Update(_dbContext);
                }

                var itemTypes = await _dbContext.ItemTypes
                    .Where(x => x.ItemGroupId == itemGroup.Id)
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .ToListAsync();


                foreach (var itemType in itemTypes)
                {
                    itemType.ItemGroupId = null;
                    itemType.UpdatedByUserId = _userService.UserId;
                    await itemType.Update(_dbContext);
                }

                itemGroup.UpdatedByUserId = _userService.UserId;
                await itemGroup.Delete(_dbContext);

                return new OperationResult(true);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                return new OperationResult(false,
                    _inventoryLocalizationService.GetString("ErrorWhileDeleteItemGroup"));
            }
        }

        public async Task<OperationDataResult<List<CommonDictionaryModel>>> GetItemGroupsDictionary()
        {
            try
            {
                var inventoryItemGroups = await _dbContext.ItemGroups
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .Select(x => new CommonDictionaryModel
                    {
                        Description = x.Description,
                        Name = x.Name,
                        Id = x.Id,
                    })
                    .ToListAsync();
                return new OperationDataResult<List<CommonDictionaryModel>>(true, inventoryItemGroups);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                return new OperationDataResult<List<CommonDictionaryModel>>(false,
                    _inventoryLocalizationService.GetString("ErrorObtainingItemGroups"));
            }
        }

        private IQueryable<ItemGroupModel> AddSelectToItemGroupQuery(IQueryable<ItemGroup> inventoryItemGroupQuery)
        {
            return inventoryItemGroupQuery
                .Select(x => new ItemGroupModel
                {
                    Description = x.Description,
                    Name = x.Name,
                    Code = x.Code,
                    Id = x.Id,
                    Parent = _dbContext.ItemGroups
                        .Where(y => y.WorkflowState != Constants.WorkflowStates.Removed)
                        .Select(y => new ItemGroupDependencyItemGroup()
                        {
                            Name = y.Name,
                            Id = y.Id,
                        })
                        .FirstOrDefault(y => y.Id == x.ParentId),
                });
        }
    }
}