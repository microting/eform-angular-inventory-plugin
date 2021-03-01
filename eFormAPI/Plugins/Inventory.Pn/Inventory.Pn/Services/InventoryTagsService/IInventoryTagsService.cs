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
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Infrastructure.Models;
    using Infrastructure.Models.Tag;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;

    /// <summary>
    /// Interface IInventoryTagsService
    /// </summary>
    public interface IInventoryTagsService
    {
        /// <summary>
        /// Gets the inventory tags.
        /// </summary>
        /// <returns>Task&lt;OperationDataResult&lt;List&lt;CommonDictionaryModel&gt;&gt;&gt;.</returns>
        Task<OperationDataResult<List<InventoryTagModel>>> GetInventoryTags();

        /// <summary>
        /// Gets the inventory tag by identifier.
        /// </summary>
        /// <param name="tagId">The tag identifier.</param>
        /// <returns>Task&lt;OperationDataResult&lt;CommonDictionaryModel&gt;&gt;.</returns>
        Task<OperationDataResult<InventoryTagModel>> GetInventoryTagById(int tagId);

        /// <summary>
        /// Updates the inventory tag.
        /// </summary>
        /// <param name="requestModel">The request model.</param>
        /// <returns>Task&lt;OperationResult&gt;.</returns>
        Task<OperationResult> UpdateInventoryTag(InventoryTagModel requestModel);

        /// <summary>
        /// Deletes the inventory tag.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns>Task&lt;OperationResult&gt;.</returns>
        Task<OperationResult> DeleteInventoryTag(int id);

        /// <summary>
        /// Creates the inventory tag.
        /// </summary>
        /// <param name="requestModel">The request model.</param>
        /// <returns>Task&lt;OperationResult&gt;.</returns>
        Task<OperationResult> CreateInventoryTag(InventoryTagModel requestModel);
    }
}