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

namespace Inventory.Pn.Services.InventoryItemTypeService
{
    using Infrastructure.Models.ItemGroup;
    using Infrastructure.Models.ItemType;
    using InventoryLocalizationService;
    using Microsoft.EntityFrameworkCore;
    using Microting.eForm.Infrastructure.Constants;
    using Microting.eFormApi.BasePn.Abstractions;
    using Microting.eFormApi.BasePn.Infrastructure.Extensions;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using Microting.eFormInventoryBase.Infrastructure.Data;
    using Microting.eFormInventoryBase.Infrastructure.Data.Entities;
    using System;
    using System.Diagnostics;
    using System.Linq;
    using System.Threading.Tasks;

    public class InventoryItemTypeSevice : IInventoryItemTypeSevice
    {
        private readonly InventoryPnDbContext _dbContext;
        private readonly IInventoryLocalizationService _inventoryLocalizationService;
        private readonly IUserService _userService;
        //private readonly IEFormCoreService _coreService;

        public InventoryItemTypeSevice(InventoryPnDbContext dbContext,
            IInventoryLocalizationService inventoryLocalizationService,
            IUserService userService/*,
            IEFormCoreService coreService*/)
        {
            _userService = userService;
            _inventoryLocalizationService = inventoryLocalizationService;
            //_coreService = coreService;
            _dbContext = dbContext;
        }
        public async Task<OperationResult> CreateItemType(CreateTypeModel createTypeModel)
        {
            try
            {
                var itemType = new ItemType
                {
                    Name = createTypeModel.Name,
                    Description = createTypeModel.Description,
                    NetWeight = createTypeModel.NetWeight,
                    GrossWeight = createTypeModel.GrossWeight,
                    UnitVolume = createTypeModel.UnitVolume,
                    CostingMethod = createTypeModel.CostingMethod,
                    ProofitProcent = createTypeModel.ProofitProcent,
                    Region = createTypeModel.Region,
                    Aviable = createTypeModel.Aviable,
                    CreatedByUserId = _userService.UserId,
                    GtinEanUpc = createTypeModel.GtinEanUpc,
                    LastPhysicalInventoryDate = createTypeModel.LastPhysicalInventoryDate,
                    UpdatedByUserId = _userService.UserId,
                    UnitPrice = createTypeModel.UnitPrice,
                    No = createTypeModel.No,
                    Usage = createTypeModel.Usage,
                    RiscDescription = createTypeModel.RiscDescription,
                    SalesUnitOfMeasure = createTypeModel.SalesUnitOfMeasure,
                };
                await itemType.Create(_dbContext);
                return new OperationResult(true);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                return new OperationResult(false,
                    _inventoryLocalizationService.GetString("ErrorWhileCreatingItemType"));
            }
        }

        public async Task<OperationResult> DeleteItemTypeById(int itemTypeId)
        {
            try
            {
                var itemTypesFromDb = await _dbContext.ItemTypes
                    .Where(x => x.Id == itemTypeId)
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .FirstOrDefaultAsync();

                if (itemTypesFromDb == null)
                {
                    return new OperationResult(false, _inventoryLocalizationService.GetString("InventoryItemTypeNotFount"));
                }

                var tags = await _dbContext.ItemTypeTags
                    .Where(x => x.ItemTypeId == itemTypeId)
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .ToListAsync();

                foreach (var tag in tags)
                {
                    tag.UpdatedByUserId = _userService.UserId;
                    await tag.Delete(_dbContext);
                }

                var typeUploadedDatas = await _dbContext.ItemTypeUploadedDatas
                    .Where(x => x.ItemTypeId == itemTypeId)
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .ToListAsync();

                foreach (var uploadedData in typeUploadedDatas)
                {
                    uploadedData.UpdatedByUserId = _userService.UserId;
                    await uploadedData.Delete(_dbContext);
                }

                var items = await _dbContext.Items
                    .Where(x => x.ItemTypeId == itemTypeId)
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .ToListAsync();

                foreach (var item in items)
                {
                    item.UpdatedByUserId = _userService.UserId;
                    await item.Delete(_dbContext);
                }

                itemTypesFromDb.UpdatedByUserId = _userService.UserId;
                await itemTypesFromDb.Delete(_dbContext);

                return new OperationResult(true);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                return new OperationResult(false,
                    _inventoryLocalizationService.GetString("ErrorWhileDeleteInventoryItemType"));
            }
        }

        public async Task<OperationDataResult<ItemTypeViewModel>> GetItemTypeById(int itemTypeId)
        {
            try
            {
                var inventoryItemTypeQuery = _dbContext.ItemTypes
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .AsQueryable();

                var inventoryItemTypeFromDb = await AddSelectToItemTypeQuery(inventoryItemTypeQuery).FirstAsync();

                if (inventoryItemTypeFromDb == null)
                {
                    return new OperationDataResult<ItemTypeViewModel>(false,
                        _inventoryLocalizationService.GetString("InventoryItemTypeNotFount"));
                }

                return new OperationDataResult<ItemTypeViewModel>(true, inventoryItemTypeFromDb);

            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                return new OperationDataResult<ItemTypeViewModel>(false,
                    _inventoryLocalizationService.GetString("ErrorWhileGetInventoryItemType"));
            }
        }

        public async Task<OperationDataResult<InventoryItemTypesPnModel>> GetItemTypes(
            ItemTypeRequest itemTypeRequest)
        {
            try
            {
                var inventoryItemTypeQuery = _dbContext.ItemTypes
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .AsQueryable();

                // sort
                if (!string.IsNullOrEmpty(itemTypeRequest.Sort))
                {
                    if (itemTypeRequest.IsSortDsc)
                    {
                        inventoryItemTypeQuery = inventoryItemTypeQuery
                            .CustomOrderByDescending(itemTypeRequest.Sort);
                    }
                    else
                    {
                        inventoryItemTypeQuery = inventoryItemTypeQuery
                            .CustomOrderBy(itemTypeRequest.Sort);
                    }
                }
                else
                {
                    inventoryItemTypeQuery = _dbContext.ItemTypes
                        .OrderBy(x => x.Id);
                }

                // filter by name
                if (!string.IsNullOrEmpty(itemTypeRequest.NameFilter))
                {
                    inventoryItemTypeQuery = inventoryItemTypeQuery
                        .Where(x => x.Name == itemTypeRequest.NameFilter);
                }

                // filter by tags
                if (itemTypeRequest.TagIds.Any())
                {
                    foreach (var tagId in itemTypeRequest.TagIds)
                    {
                        inventoryItemTypeQuery = inventoryItemTypeQuery.Where(x => x.InventoryTags.Any(y =>
                            y.Id == tagId && y.WorkflowState != Constants.WorkflowStates.Removed));
                    }
                }

                // calculate total before pagination
                var total = inventoryItemTypeQuery.Count();

                // pagination
                inventoryItemTypeQuery
                    = inventoryItemTypeQuery
                        .Skip(itemTypeRequest.Offset)
                        .Take(itemTypeRequest.PageSize);

                // add select and take objects from db
                var inventoryItemTypeFromDb = await AddSelectToItemTypeQuery(inventoryItemTypeQuery).ToListAsync();
                var returnValue = new InventoryItemTypesPnModel
                {
                    InventoryItemTypes = inventoryItemTypeFromDb,
                    Total = total,
                };

                return new OperationDataResult<InventoryItemTypesPnModel>(true, returnValue);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                return new OperationDataResult<InventoryItemTypesPnModel>(false,
                    _inventoryLocalizationService.GetString("ErrorObtainingLists"));
            }
        }

        public async Task<OperationResult> UpdateItemType(UpdateItemTypeModel itemTypeModel)
        {
            try
            {
                var itemTypesFromDb = await _dbContext.ItemTypes
                    .Where(x => x.Id == itemTypeModel.Id)
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .FirstOrDefaultAsync();

                if (itemTypesFromDb == null)
                {
                    return new OperationResult(false, _inventoryLocalizationService.GetString("InventoryItemTypeNotFount"));
                }

                itemTypesFromDb.LastPhysicalInventoryDate = itemTypeModel.LastPhysicalInventoryDate;
                itemTypesFromDb.SalesUnitOfMeasure = itemTypeModel.SalesUnitOfMeasure;
                itemTypesFromDb.RiscDescription = itemTypeModel.RiscDescription;
                itemTypesFromDb.ProofitProcent = itemTypeModel.ProofitProcent;
                itemTypesFromDb.CostingMethod = itemTypeModel.CostingMethod;
                itemTypesFromDb.Description = itemTypeModel.Description;
                itemTypesFromDb.GrossWeight = itemTypeModel.GrossWeight;
                itemTypesFromDb.GtinEanUpc = itemTypeModel.GtinEanUpc;
                itemTypesFromDb.UnitVolume = itemTypeModel.UnitVolume;
                itemTypesFromDb.UnitPrice = itemTypeModel.UnitPrice;
                itemTypesFromDb.NetWeight = itemTypeModel.NetWeight;
                itemTypesFromDb.Aviable = itemTypeModel.Aviable;
                itemTypesFromDb.Region = itemTypeModel.Region;
                itemTypesFromDb.Usage = itemTypeModel.Usage;
                itemTypesFromDb.UpdatedByUserId = _userService.UserId;
                itemTypesFromDb.Name = itemTypeModel.Name;
                itemTypesFromDb.No = itemTypeModel.No;

                await itemTypesFromDb.Update(_dbContext);

                return new OperationResult(true);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                return new OperationResult(false,
                    _inventoryLocalizationService.GetString("ErrorWhileUpdateInventoryItemType"));
            }
        }

        private IQueryable<ItemTypeViewModel> AddSelectToItemTypeQuery(IQueryable<ItemType> itemTypeQuery)
        {
            return itemTypeQuery
                .Select(x => new ItemTypeViewModel
                {
                    LastPhysicalInventoryDate = x.LastPhysicalInventoryDate,
                    SalesUnitOfMeasure = x.SalesUnitOfMeasure,
                    RiscDescription = x.RiscDescription,
                    ProofitProcent = x.ProofitProcent,
                    ItemGroupDependency = _dbContext.ItemGroupDependencys
                        .Where(y => y.ItemTypeId == x.Id)
                        .Where(y => y.WorkflowState != Constants.WorkflowStates.Removed)
                        .Select(y => new ItemGroupViewModel
                        {
                            Id = x.ItemGroup.Id,
                            Description = x.ItemGroup.Description,
                            Code = x.ItemGroup.Code,
                            Name = x.ItemGroup.Name,
                            ParentId = x.ItemGroup.ParentId,
                        })
                        .FirstOrDefault(),
                    ItemTypeDependency = _dbContext.ItemTypeDependencys
                        .Where(y => y.ItemTypeId == x.Id)
                        .Where(y => y.WorkflowState != Constants.WorkflowStates.Removed)
                        .Select(y => new ItemTypeViewModel
                        {
                            LastPhysicalInventoryDate = y.DependItemType.LastPhysicalInventoryDate,
                            SalesUnitOfMeasure = y.DependItemType.SalesUnitOfMeasure,
                            RiscDescription = y.DependItemType.RiscDescription,
                            ProofitProcent = y.DependItemType.ProofitProcent,
                            CostingMethod = y.DependItemType.CostingMethod,
                            Description = y.DependItemType.Description,
                            GrossWeight = y.DependItemType.GrossWeight,
                            GtinEanUpc = y.DependItemType.GtinEanUpc,
                            UnitVolume = y.DependItemType.UnitVolume,
                            NetWeight = y.DependItemType.NetWeight,
                            UnitPrice = y.DependItemType.UnitPrice,
                            Aviable = y.DependItemType.Aviable,
                            Comment = y.DependItemType.Comment,
                            Region = y.DependItemType.Region,
                            Usage = y.DependItemType.Usage,
                            EformId = y.DependItemType.Id,
                            Name = y.DependItemType.Name,
                            Id = y.DependItemType.Id,
                            No = y.DependItemType.No,
                        })
                        .ToList(), // todo tags and group, if need
                    CostingMethod = x.CostingMethod,
                    Description = x.Description,
                    GrossWeight = x.GrossWeight,
                    GtinEanUpc = x.GtinEanUpc,
                    UnitVolume = x.UnitVolume,
                    NetWeight = x.NetWeight,
                    UnitPrice = x.UnitPrice,
                    Comment = x.Comment,
                    EformId = x.EformId,
                    Aviable = x.Aviable,
                    Region = x.Region,
                    Usage = x.Usage,
                    Name = x.Name,
                    Id = x.Id,
                    No = x.No,
                }); // todo tags
        }
    }
}
