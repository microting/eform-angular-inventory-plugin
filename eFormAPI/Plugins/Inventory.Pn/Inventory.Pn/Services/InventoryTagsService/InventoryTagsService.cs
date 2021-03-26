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

namespace Inventory.Pn.Services.InventoryTagsService
{
    using System;
    using Microsoft.Extensions.Logging;
    using Microting.eFormApi.BasePn.Abstractions;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using Microting.eFormInventoryBase.Infrastructure.Data;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using InventoryLocalizationService;
    using Microsoft.EntityFrameworkCore;
    using Microting.eForm.Infrastructure.Constants;
    using Microting.eFormApi.BasePn.Infrastructure.Models.Common;
    using Microting.eFormInventoryBase.Infrastructure.Data.Entities;

    /// <summary>
    /// Class InventoryTagsService.
    /// Implements the <see cref="Inventory.Pn.Services.InventoryTagsService.IInventoryTagsService" />
    /// </summary>
    /// <seealso cref="Inventory.Pn.Services.InventoryTagsService.IInventoryTagsService" />
    public class InventoryTagsService: IInventoryTagsService
    {
        private readonly ILogger<InventoryTagsService> _logger;

        private readonly IInventoryLocalizationService _inventoryLocalizationService;

        private readonly InventoryPnDbContext _dbContext;

        private readonly IUserService _userService;

        public InventoryTagsService(
            IInventoryLocalizationService inventoryLocalizationService,
            ILogger<InventoryTagsService> logger,
            InventoryPnDbContext dbContext,
            IUserService userService)
        {
            _inventoryLocalizationService = inventoryLocalizationService;
            _logger = logger;
            _dbContext = dbContext;
            _userService = userService;
        }

        /// <summary>Gets the inventory tags.</summary>
        public async Task<OperationDataResult<List<CommonTagModel>>> GetInventoryTags()
        {
            try
            {
                var inventoryTags = await _dbContext.InventoryTags
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .AsNoTracking()
                    .Select(x => new CommonTagModel
                    {
                        Id = x.Id,
                        Name = x.Name
                    }).OrderBy(x => x.Name).ToListAsync();

                return new OperationDataResult<List<CommonTagModel>>(
                    true,
                    inventoryTags);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                _logger.LogError(e.Message);
                return new OperationDataResult<List<CommonTagModel>>(
                    false,
                    _inventoryLocalizationService.GetString("ErrorWhileObtainingInventoryTags"));
            }
        }

        /// <summary>
        /// Gets the inventory tag by identifier.
        /// </summary>
        /// <param name="tagId">The tag identifier.</param>
        /// <returns>Task&lt;OperationDataResult&lt;CommonDictionaryModel&gt;&gt;.</returns>
        public async Task<OperationDataResult<CommonTagModel>> GetInventoryTagById(int tagId)
        {
            try
            {
                var inventoryTags = await _dbContext.InventoryTags
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .Where(x=> x.Id == tagId)
                    .AsNoTracking()
                    .Select(x => new CommonTagModel
                    {
                        Id = x.Id,
                        Name = x.Name
                    }).OrderBy(x => x.Name)
                    .FirstAsync();

                return new OperationDataResult<CommonTagModel>(
                    true,
                    inventoryTags);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                _logger.LogError(e.Message);
                return new OperationDataResult<CommonTagModel>(
                    false,
                    _inventoryLocalizationService.GetString("ErrorWhileObtainingInventoryTag"));
            }
        }

        /// <summary>
        /// Creates the inventory tag.
        /// </summary>
        /// <param name="requestModel">The request model.</param>
        /// <returns>Task&lt;OperationResult&gt;.</returns>
        public async Task<OperationResult> CreateInventoryTag(CommonTagModel requestModel)
        {
            try
            {
                var inventoryTag = new InventoryTag
                {
                    Name = requestModel.Name,
                    CreatedByUserId = _userService.UserId,
                    UpdatedByUserId = _userService.UserId,
                };

                await inventoryTag.Create(_dbContext);

                return new OperationResult(
                    true,
                    _inventoryLocalizationService.GetString("InventoryTagCreatedSuccessfully"));
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                _logger.LogError(e.Message);
                return new OperationResult(
                    false,
                    _inventoryLocalizationService.GetString("ErrorWhileCreatingInventoryTag"));
            }
        }

        /// <summary>
        /// Deletes the inventory tag.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns>Task&lt;OperationResult&gt;.</returns>
        public async Task<OperationResult> DeleteInventoryTag(int id)
        {
            try
            {
                var inventoryTag = await _dbContext.InventoryTags
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .FirstOrDefaultAsync(x => x.Id == id);

                if (inventoryTag == null)
                {
                    return new OperationResult(
                        false,
                        _inventoryLocalizationService.GetString("InventoryTagNotFound"));
                }

                var itemTypeTags = await _dbContext.ItemTypeTags
                    .Where(x => x.InventoryTagId == inventoryTag.Id).ToListAsync();

                // removing from ItemTypeTags table
                foreach (var itemTypeTag in itemTypeTags)
                {
                    itemTypeTag.UpdatedByUserId = _userService.UserId;
                    await itemTypeTag.Delete(_dbContext);
                }

                // removing tag 
                inventoryTag.UpdatedByUserId = _userService.UserId;
                await inventoryTag.Delete(_dbContext);

                return new OperationResult(
                    true,
                    _inventoryLocalizationService.GetString("InventoryTagRemovedSuccessfully"));
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                _logger.LogError(e.Message);
                return new OperationResult(
                    false,
                    _inventoryLocalizationService.GetString("ErrorWhileRemovingInventoryTag"));
            }
        }

        /// <summary>
        /// Updates the inventory tag.
        /// </summary>
        /// <param name="requestModel">The request model.</param>
        /// <returns>Task&lt;OperationResult&gt;.</returns>
        public async Task<OperationResult> UpdateInventoryTag(CommonTagModel requestModel)
        {
            try
            {
                var itemsPlanningTag = await _dbContext.InventoryTags
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .FirstOrDefaultAsync(x => x.Id == requestModel.Id);

                if (itemsPlanningTag == null)
                {
                    return new OperationResult(
                        false,
                        _inventoryLocalizationService.GetString("InventoryTagNotFound"));
                }

                itemsPlanningTag.Name = requestModel.Name;
                itemsPlanningTag.UpdatedByUserId = _userService.UserId;

                await itemsPlanningTag.Update(_dbContext);

                return new OperationResult(true,
                    _inventoryLocalizationService.GetString("InventoryTagUpdatedSuccessfully"));
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                _logger.LogError(e.Message);
                return new OperationResult(false,
                    _inventoryLocalizationService.GetString("ErrorWhileUpdatingInventoryTag"));
            }
        }
    }
}