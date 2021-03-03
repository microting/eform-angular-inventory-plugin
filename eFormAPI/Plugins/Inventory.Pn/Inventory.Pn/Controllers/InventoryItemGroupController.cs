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
    using Infrastructure.Models.ItemGroup;
    using Microsoft.AspNetCore.Authorization;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using Microsoft.AspNetCore.Mvc;
    using Services.InventoryItemGroupService;

    [Authorize]
    public class InventoryItemGroupController : Controller
    {
        private readonly IInventoryItemGroupService _inventoryItemGroupService;

        public InventoryItemGroupController(IInventoryItemGroupService inventoryItemGroupService)
        {
            _inventoryItemGroupService = inventoryItemGroupService;
        }

        [HttpPost]
        [Route("api/inventory-pn/item-groups/index")]
        public async Task<OperationDataResult<ItemGroupPnModel>> Index(
            [FromBody] ItemGroupRequestModel inventoryItemTypeRequestModel)
        {
            return await _inventoryItemGroupService.GetItemGroups(inventoryItemTypeRequestModel);
        }

        [HttpGet]
        [Route("api/inventory-pn/item-groups/{id}")]
        public async Task<OperationDataResult<ItemGroupModel>> GetInventoryItemGroupById(int id)
        {
            return await _inventoryItemGroupService.GetItemGroupById(id);
        }

        [HttpPut]
        [Route("api/inventory-pn/item-groups")]
        public async Task<OperationResult> UpdateInventoryItemGroup([FromBody] ItemGroupUpdateModel itemGroupUpdateInventoryTypeModel)
        {
            return await _inventoryItemGroupService.UpdateItemGroup(itemGroupUpdateInventoryTypeModel);
        }

        [HttpDelete]
        [Route("api/inventory-pn/item-group/{id}")]
        public async Task<OperationResult> DeleteInventoryItemGroupById(int id)
        {
            return await _inventoryItemGroupService.DeleteItemGroupById(id);
        }

        [HttpPost]
        [Route("api/inventory-pn/item-groups")]
        public async Task<OperationResult> CreateInventoryType([FromBody] ItemGroupCreateModel itemGroupCreateInventoryTypeModel)
        {
            return await _inventoryItemGroupService.CreateItemGroup(itemGroupCreateInventoryTypeModel);
        }
    }
}