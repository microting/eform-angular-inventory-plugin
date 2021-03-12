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
    using System.Collections.Generic;
    using System.Diagnostics;
    using System.Linq;
    using System.Threading.Tasks;
    using Microting.eFormApi.BasePn.Infrastructure.Models.Common;
    using Microting.eFormInventoryBase.Infrastructure.Const;

    public class InventoryItemTypeService : IInventoryItemTypeService
    {
        private readonly InventoryPnDbContext _dbContext;
        private readonly IInventoryLocalizationService _inventoryLocalizationService;
        private readonly IUserService _userService;
        //private readonly IEFormCoreService _coreService;

        public InventoryItemTypeService(InventoryPnDbContext dbContext,
            IInventoryLocalizationService inventoryLocalizationService,
            IUserService userService/*,
            IEFormCoreService coreService*/)
        {
            _userService = userService;
            _inventoryLocalizationService = inventoryLocalizationService;
            //_coreService = coreService;
            _dbContext = dbContext;
        }
        public async Task<OperationResult> CreateItemType(ItemTypeCreateModel itemTypeCreateModel)
        {
            try
            {
                var tags = new List<InventoryTag>();
                if (itemTypeCreateModel.TagIds.Count > 0)
                {
                    tags = _dbContext.InventoryTags
                        .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                        .Where(x => itemTypeCreateModel.TagIds.Contains(x.Id))
                        .ToList();

                    if (tags.Count != itemTypeCreateModel.TagIds.Count)
                    {
                        return new OperationResult(false,
                            _inventoryLocalizationService.GetString("TagsNotFound"));
                    }
                }

                var itemType = new ItemType
                {
                    Name = itemTypeCreateModel.Name,
                    Description = itemTypeCreateModel.Description,
                    CreatedByUserId = _userService.UserId,
                    UpdatedByUserId = _userService.UserId,
                    Usage = itemTypeCreateModel.Usage,
                    RiskDescription = itemTypeCreateModel.RiskDescription,
                    ItemGroupId = itemTypeCreateModel.ItemGroupId,
                };
                await itemType.Create(_dbContext);

                // create dependencies
                foreach (var dependency in itemTypeCreateModel.Dependencies)
                {
                    // create item group dependency
                    var dependencyItemGroup = new ItemGroupDependency
                    {
                        CreatedByUserId = _userService.UserId,
                        UpdatedByUserId = _userService.UserId,
                        ItemGroupId = dependency.ItemGroupId,
                        ItemTypeId = itemType.Id,
                    };
                    await dependencyItemGroup.Create(_dbContext);

                    // create item type dependency
                    foreach (var dependencyItemType in dependency.ItemTypesIds
                        .Select(dependencyItemTypesId => new ItemTypeDependency
                        {
                            CreatedByUserId = _userService.UserId,
                            UpdatedByUserId = _userService.UserId,
                            ParentItemTypeId = itemType.Id,
                            DependItemTypeId = dependencyItemTypesId,
                        }))
                    {
                        await dependencyItemType.Create(_dbContext);
                    }
                }

                // creating a dependency between tag and item type
                foreach (var itemTypeTag in tags.Select(inventoryTag => new ItemTypeTag
                {
                    CreatedByUserId = _userService.UserId,
                    UpdatedByUserId = _userService.UserId,
                    InventoryTagId = inventoryTag.Id,
                    ItemTypeId = itemType.Id,
                }))
                {
                    await itemTypeTag.Create(_dbContext);
                }

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

        public async Task<OperationDataResult<List<CommonDictionaryModel>>> GetItemTypesDictionary()
        {
            try
            {
                var inventoryItemTypes = await _dbContext.ItemTypes
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .Select(x => new CommonDictionaryModel
                    {
                        Name = x.Name,
                        Description = x.Description,
                        Id = x.Id,
                    })
                    .ToListAsync();

                return new OperationDataResult<List<CommonDictionaryModel>>(true, inventoryItemTypes);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                return new OperationDataResult<List<CommonDictionaryModel>>(false,
                    _inventoryLocalizationService.GetString("ErrorObtainingLists"));
            }
        }

        public async Task<OperationDataResult<ItemTypeModel>> GetItemTypeById(int itemTypeId)
        {
            try
            {
                var inventoryItemTypeQuery = _dbContext.ItemTypes
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .Where(x => x.Id == itemTypeId)
                .AsQueryable();

                var inventoryItemTypeFromDb = await AddSelectToItemTypeQueryForFullObject(inventoryItemTypeQuery).FirstAsync();

                if (inventoryItemTypeFromDb == null)
                {
                    return new OperationDataResult<ItemTypeModel>(false,
                        _inventoryLocalizationService.GetString("InventoryItemTypeNotFount"));
                }

                return new OperationDataResult<ItemTypeModel>(true, inventoryItemTypeFromDb);

            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                return new OperationDataResult<ItemTypeModel>(false,
                    _inventoryLocalizationService.GetString("ErrorWhileGetInventoryItemType"));
            }
        }

        public async Task<OperationDataResult<Paged<ItemTypeSimpleModel>>> GetItemTypes(
            ItemTypeRequest itemTypeRequest)
        {
            try
            {
                var inventoryItemTypeQuery = _dbContext.ItemTypes
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
                        .Where(x => x.Name.Contains(itemTypeRequest.NameFilter));
                }

                // filter by tags
                if (itemTypeRequest.TagIds.Any())
                {
                    foreach (var tagId in itemTypeRequest.TagIds)
                    {
                        inventoryItemTypeQuery = inventoryItemTypeQuery
                            .Where(x => x.ItemTypeTags
                                .Where(y => y.WorkflowState != Constants.WorkflowStates.Removed)
                                .Any(y => y.InventoryTagId == tagId));
                    }
                }

                inventoryItemTypeQuery = inventoryItemTypeQuery
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed);

                // calculate total before pagination
                var total = await inventoryItemTypeQuery.Select(x => x.Id).CountAsync();

                // pagination
                inventoryItemTypeQuery
                    = inventoryItemTypeQuery
                        .Skip(itemTypeRequest.Offset)
                        .Take(itemTypeRequest.PageSize);

                // add select and take objects from db
                var inventoryItemTypeFromDb = await AddSelectToItemTypeQuery(inventoryItemTypeQuery, _userService).ToListAsync();

                var returnValue = new Paged<ItemTypeSimpleModel>
                {
                    Entities = inventoryItemTypeFromDb,
                    Total = total,
                };

                return new OperationDataResult<Paged<ItemTypeSimpleModel>>(true, returnValue);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                return new OperationDataResult<Paged<ItemTypeSimpleModel>>(false,
                    _inventoryLocalizationService.GetString("ErrorObtainingLists"));
            }
        }

        public async Task<OperationResult> UpdateItemType(ItemTypeUpdateModel model)
        {
            try
            {
                var itemTypesFromDb = await _dbContext.ItemTypes
                    .Where(x => x.Id == model.Id)
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .FirstOrDefaultAsync();

                if (itemTypesFromDb == null)
                {
                    return new OperationResult(false, _inventoryLocalizationService.GetString("InventoryItemTypeNotFount"));
                }

                itemTypesFromDb.RiskDescription = model.RiskDescription;
                itemTypesFromDb.UpdatedByUserId = _userService.UserId;
                itemTypesFromDb.ItemGroupId = model.ItemGroupId;
                itemTypesFromDb.Description = model.Description;
                itemTypesFromDb.Usage = model.Usage;
                itemTypesFromDb.Name = model.Name;

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

        private static IQueryable<ItemTypeSimpleModel> AddSelectToItemTypeQuery(IQueryable<ItemType> itemTypeQuery, IUserService userService)
        {
            return itemTypeQuery
                .Select(x => new ItemTypeSimpleModel
                {

                    RiskDescription = x.RiskDescription,
                    Description = x.Description,
                    EformId = x.EformId,
                    Usage = x.Usage,
                    Name = x.Name,
                    Id = x.Id,
                    CreatedDate = x.CreatedAt,
                    CreatedBy = userService.GetFullNameUserByUserIdAsync(x.CreatedByUserId).Result,
                    DangerLabelImageName = x.ItemTypeUploadedDatas
                        .Where(y => y.WorkflowState != Constants.WorkflowStates.Removed)
                        .Where(y => y.Type == TypeUploadedData.Danger)
                        .Select(y => y.FileName)
                        .FirstOrDefault(),
                    PictogramImageName = x.ItemTypeUploadedDatas
                        .Where(y => y.WorkflowState != Constants.WorkflowStates.Removed)
                        .Where(y => y.Type == TypeUploadedData.Pictogram)
                        .Select(y => y.FileName)
                        .FirstOrDefault(),
                    ParentTypeName = x.ParentItemTypes
                        .Where(y => y.WorkflowState != Constants.WorkflowStates.Removed)
                        .Select(y => y.DependItemType.Name)
                        .FirstOrDefault(),
                    Tags = x.ItemTypeTags
                        .Where(y => y.WorkflowState != Constants.WorkflowStates.Removed)
                        .Where(y => y.ItemTypeId == x.Id)
                        .Select(y => new CommonTagModel
                        {
                            Id = y.InventoryTag.Id,
                            Name = y.InventoryTag.Name,
                        })
                        .ToList(),
                });
        }

        private static IQueryable<ItemTypeModel> AddSelectToItemTypeQueryForFullObject(IQueryable<ItemType> itemTypeQuery)
        {
            return itemTypeQuery
                 .Select(x => new ItemTypeModel
                 {
                     RiskDescription = x.RiskDescription,
                     Description = x.Description,
                     Usage = x.Usage,
                     Name = x.Name,
                     Id = x.Id,
                     TagIds = x.ItemTypeTags
                         .Where(y => y.WorkflowState != Constants.WorkflowStates.Removed)
                         .Where(y => y.ItemTypeId == x.Id)
                         .Select(y => y.InventoryTag.Id)
                         .ToList(),
                     //Dependencies = new List<ItemTypeDependencies>
                     //{
                     //    new ItemTypeDependencies()
                     //}
                     //ItemGroupDependency = GetGroupDependencyByItemTypeId(x.Id, dbContext),
                     //ItemTypeDependency = dbContext.ItemTypeDependencys
                     //    .Where(y => y.ItemTypeId == x.Id)
                     //    .Where(y => y.WorkflowState != Constants.WorkflowStates.Removed)
                     //    .Select(y => new CommonDictionaryModel
                     //    {
                     //        Description = y.DependItemType.Description,
                     //        Name = y.DependItemType.Name,
                     //        Id = y.DependItemType.Id,
                     //    })
                     //    .ToList(),
                 });
        }

        private static ItemTypeDependencyItemGroup GetGroupDependencyByItemTypeId(int itemTypeId, InventoryPnDbContext dbContext)
        {
            var itemGroupId = dbContext.ItemGroupDependencys
                .Where(y => y.ItemTypeId == itemTypeId)
                .Where(y => y.WorkflowState != Constants.WorkflowStates.Removed)
                .Select(y => y.ItemGroupId).FirstOrDefault();

            return dbContext.ItemGroups
                .Where(z => z.Id == itemGroupId)
                .Select(z => new ItemTypeDependencyItemGroup
                {
                    Name = z.Name,
                    Id = z.Id,
                }).FirstOrDefault();
        }
    }
}
