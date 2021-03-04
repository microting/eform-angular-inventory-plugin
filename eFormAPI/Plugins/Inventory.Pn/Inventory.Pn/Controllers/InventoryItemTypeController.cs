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

namespace Inventory.Pn.Controllers
{
    using System.Threading.Tasks;
    using Infrastructure.Models.ItemType;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using Services.InventoryItemTypeService;

    [Authorize]
    public class InventoryItemTypeController : Controller
    {
        private readonly IInventoryItemTypeService _inventoryItemTypeService;

        public InventoryItemTypeController(IInventoryItemTypeService inventoryItemTypeService)
        {
            _inventoryItemTypeService = inventoryItemTypeService;
        }

        /// <summary>
        /// Indexes the specified inventory item type request.
        /// </summary>
        /// <param name="itemTypeRequest">The inventory item type request.</param>
        /// <returns>Task&lt;OperationDataResult&lt;ItemTypesPnModel&gt;&gt;.</returns>
        [HttpPost]
        [Route("api/inventory-pn/item-types/index")]
        public async Task<OperationDataResult<ItemTypesPnModel>> Index(
            [FromBody] ItemTypeRequest itemTypeRequest)
        {
            return await _inventoryItemTypeService.GetItemTypes(itemTypeRequest);
        }

        /// <summary>
        /// Gets the inventory type by identifier.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns>Task&lt;OperationDataResult&lt;ItemTypeModel&gt;&gt;.</returns>
        [HttpGet]
        [Route("api/inventory-pn/item-types/{id}")]
        public async Task<OperationDataResult<ItemTypeSimpleModel>> GetInventoryTypeById(int id)
        {
            return await _inventoryItemTypeService.GetItemTypeById(id);
        }

        /// <summary>
        /// Updates the type of the inventory.
        /// </summary>
        /// <param name="itemTypeUpdateModel">The update inventory type model.</param>
        /// <returns>Task&lt;OperationResult&gt;.</returns>
        [HttpPut]
        [Route("api/inventory-pn/item-types")]
        public async Task<OperationResult> UpdateInventoryType([FromBody] ItemTypeUpdateModel itemTypeUpdateModel)
        {
            return await _inventoryItemTypeService.UpdateItemType(itemTypeUpdateModel);
        }

        /// <summary>
        /// Deletes the inventory type by identifier.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns>Task&lt;OperationResult&gt;.</returns>
        [HttpDelete]
        [Route("api/inventory-pn/item-types/{id}")]
        public async Task<OperationResult> DeleteInventoryTypeById(int id)
        {
            return await _inventoryItemTypeService.DeleteItemTypeById(id);
        }

        /// <summary>
        /// Creates the type of the inventory.
        /// </summary>
        /// <param name="itemTypeCreateModel">The create inventory type model.</param>
        /// <returns>Task&lt;OperationResult&gt;.</returns>
        [HttpPost]
        [Route("api/inventory-pn/item-types")]
        public async Task<OperationResult> CreateInventoryType([FromBody]ItemTypeCreateModel itemTypeCreateModel)
        {
            return await _inventoryItemTypeService.CreateItemType(itemTypeCreateModel);
        }
    }
}