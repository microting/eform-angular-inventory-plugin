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

namespace Inventory.Pn.Services.UploadedDataService
{
    using System;
    using System.Diagnostics;
    using System.IO;
    using System.Threading.Tasks;
    using Infrastructure.Models.UploadedData;
    using Microting.eForm.Dto;
    using Microting.eFormApi.BasePn.Abstractions;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using Microting.eFormInventoryBase.Infrastructure.Data;
    using Microting.eFormInventoryBase.Infrastructure.Data.Entities;

    public class UploadedDataService : IUploadedDataService
    {
        private readonly InventoryPnDbContext _dbContext;
        private readonly IUserService _userService;
        private readonly IEFormCoreService _coreService;

        private string SaveFolder =>
            Path.Combine(_coreService.GetCore().Result.GetSdkSetting(Settings.fileLocationPicture).Result, "itemTypeImageFiles");

        public UploadedDataService(InventoryPnDbContext dbContext,
            IUserService userService,
            IEFormCoreService coreService)
        {
            _dbContext = dbContext;
            _userService = userService;
            _coreService = coreService;
        }

        public async Task<OperationResult> UploadUploadedData(UploadedDataModel uploadModel)
        {
            try
            {
                var core = await _coreService.GetCore();

                Directory.CreateDirectory(SaveFolder);
                foreach (var file in uploadModel.Files)
                {
                    // get the file extension. we separate the file name with a separator (dot) and get the last element of the resulting array
                    var typeFile = file.FileName.Split('.')[^1];


                    var fileName = $"ItemType_{uploadModel.ItemTypeId}_{DateTime.Now.Ticks}.{typeFile}";

                    if (file.Length > 0)
                    {
                        await using var stream = new FileStream(Path.Combine(SaveFolder, fileName), FileMode.Create);
                        await file.CopyToAsync(stream);
                    }
                    if (core.GetSdkSetting(Settings.swiftEnabled).ToString()?.ToLower() == "true")
                    {
                        await core.PutFileToStorageSystem(Path.Combine(SaveFolder, fileName), fileName);
                    }

                    var uploadedData = new UploadedDataType
                    {
                        FileName = fileName,
                        ItemTypeId = uploadModel.ItemTypeId,
                        Type = uploadModel.ItemTypeImageType,
                        UpdatedByUserId = _userService.UserId,
                        CreatedByUserId = _userService.UserId,
                    };

                    await uploadedData.Create(_dbContext);
                }
                return new OperationResult(true);

            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _coreService.LogException(e.Message);
                return new OperationResult(false);
            }
        }

        //public async Task<IActionResult> DownloadUploadedData(string fileName)
        //{
        //    var core = await _coreService.GetCore();

        //    if (core.GetSdkSetting(Settings.swiftEnabled).ToString()?.ToLower() == "true")
        //    {
        //        var ss = await core.GetFileFromSwiftStorage(fileName);

        //        if (ss == null)
        //        {
        //            return new NotFoundResult();
        //        }
        //        return new OkObjectResult(ss);
        //    }

        //    fileName = Path.Combine(SaveFolder, fileName);

        //    byte[] fileBytes;

        //    if (File.Exists(fileName))
        //    {
        //        fileBytes = await File.ReadAllBytesAsync(fileName);
        //    }
        //    else
        //    {
        //        return new NotFoundResult();
        //    }

        //    return new FileContentResult(fileBytes, MediaTypeHeaderValue.Parse("image/*"))
        //    {
        //        FileDownloadName = fileName
        //    };
        //}
    }
}