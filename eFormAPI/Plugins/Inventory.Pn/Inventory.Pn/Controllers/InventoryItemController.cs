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
    using Infrastructure.Models.Item;
    using Microsoft.AspNetCore.Mvc;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using Services.InventoryItemService;

    public class InventoryItemController : Controller
    {

        private readonly IInventoryItemService _inventoryItemService;

        public InventoryItemController(IInventoryItemService inventoryItemService)
        {
            _inventoryItemService = inventoryItemService;
        }

        [HttpPost]
        [Route("api/inventory-pn/item/index")]
        public async Task<OperationDataResult<ItemPnModel>> Index(
            [FromBody] ItemRequestModel itemRequestModel)
        {
            return await _inventoryItemService.GetItems(itemRequestModel);
        }

        //[HttpGet]
        //[Route("api/inventory-pn/item/{id}")]
        //public async Task<OperationDataResult<ItemModel>> GetInventoryItemGroupById(int id)
        //{
        //    return await _inventoryItemService.GetItemById(id);
        //}

        [HttpPut]
        [Route("api/inventory-pn/item")]
        public async Task<OperationResult> UpdateInventoryItemGroup([FromBody] ItemUpdateModel itemUpdateModel)
        {
            return await _inventoryItemService.UpdateItem(itemUpdateModel);
        }

        [HttpDelete]
        [Route("api/inventory-pn/item/{id}")]
        public async Task<OperationResult> DeleteInventoryItemGroupById(int id)
        {
            return await _inventoryItemService.DeleteItemById(id);
        }

        [HttpPost]
        [Route("api/inventory-pn/item")]
        public async Task<OperationResult> CreateInventoryType([FromBody] ItemCreateModel itemCreateModel)
        {
            return await _inventoryItemService.CreateItem(itemCreateModel);
        }
    }
}