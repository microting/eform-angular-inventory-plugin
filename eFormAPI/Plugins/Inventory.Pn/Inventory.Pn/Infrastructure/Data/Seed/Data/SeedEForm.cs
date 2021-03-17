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

namespace Inventory.Pn.Infrastructure.Data.Seed.Data
{
    using System;
    using System.Collections.Generic;
    using System.Diagnostics;
    using System.Linq;
    using System.Threading.Tasks;
    using Const;
    using eFormCore;
    using Microsoft.EntityFrameworkCore;
    using Microting.eForm.Infrastructure.Constants;
    using Microting.eForm.Infrastructure.Models;

    public class SeedEForm
    {
        public static async Task<int> CreateEform(Core core)
        {
            var timeZone = "Europe/Copenhagen";
            TimeZoneInfo timeZoneInfo;

            try
            {
                timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById(timeZone);
            }
            catch
            {
                timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById("E. Europe Standard Time");
            }

            var language = await core.DbContextHelper.GetDbContext().Languages.FirstAsync();
            var templatesDto = await core.TemplateItemReadAll(false,
                "",
                "Chemical APV",
                false,
                "",
                new List<int>(),
                timeZoneInfo,
                language
            );

            if (templatesDto.Count > 0)
            {
                return templatesDto.First().Id;
            }

            var mainElement = new MainElement
            {
                Id = InventoryEFormConst.EFormId,
                Label = "Chemical APV|Chemical APV|Chemical APV",
                Repeated = 0,
                StartDate = new DateTime(2021, 3, 15),
                EndDate = new DateTime(2031, 3, 15),
                Language = "da",
                MultiApproval = false,
                FastNavigation = false,
                DisplayOrder = 0,
            };
            var dataItems = new List<DataItem>
            {
                new ShowPdf(
                    373143,
                    false,
                    false,
                    "Product picture",
                    "",
                    Constants.FieldColors.Grey,
                    0,
                    false,
                    "https://eform.microting.com/app_files/uploads/20210315102928_14942_3ff74d495d9e4ae0599105df176f2bdd.pdf"
                ),
                new None(
                    373144,
                    false,
                    false,
                    "Product name",
                    "ItemType.Name",
                    Constants.FieldColors.Grey,
                    1,
                    false
                ),
                new None(
                    373145,
                    false,
                    false,
                    "Expires",
                    "Item.Expires",
                    Constants.FieldColors.Grey,
                    2,
                    false
                ),
                new None(
                    373146,
                    false,
                    false,
                    "Location",
                    "Item.Location",
                    Constants.FieldColors.Grey,
                    3,
                    false
                ),
                new None(
                    373147,
                    false,
                    false,
                    "Dependant products",
                    @"<br>foreach ItemGroupDependency {<br>&nbsp; Add new info field with title of the ItemGroup<br>&nbsp; Set descriptio to each ItemTypeDependency in that ItemGroup<br>}",
                    Constants.FieldColors.Grey,
                    4,
                    false
                ),
                new None(
                    373148,
                    false,
                    false,
                    "Usage",
                    "ItemType.Usage",
                    Constants.FieldColors.Grey,
                    5,
                    false
                ),
                new None(
                    373149,
                    false,
                    false,
                    "Other",
                    "ItemType.Description",
                    Constants.FieldColors.Grey,
                    6,
                    false
                ),
                new ShowPdf(
                    373150,
                    false,
                    false,
                    "Piktogram",
                    "Generate a PDF with all images from the ItemType.Pictogram for this ItemType",
                    Constants.FieldColors.Grey,
                    7,
                    false,
                    "https://eform.microting.com/app_files/uploads/20210315103951_14944_3ff74d495d9e4ae0599105df176f2bdd.pdf"
                ),
                new None(
                    373151,
                    false,
                    false,
                    "Risc description",
                    "ItemType.RiscDescription",
                    Constants.FieldColors.Grey,
                    8,
                    false
                ),
                new ShowPdf(
                    373152,
                    false,
                    false,
                    "Danger label",
                    "Generate a PDF with all images from the ItemType.DangerLabel for this ItemType",
                    Constants.FieldColors.Grey,
                    9,
                    false,
                    "https://eform.microting.com/app_files/uploads/20210315104009_14945_3ff74d495d9e4ae0599105df176f2bdd.pdf"
                ),
            };

            var dataElement = new DataElement(
                142344,
                "Chemical APV",
                0,
                "",
                false,
                false,
                false,
                false,
                "",
                false,
                new List<DataItemGroup>(),
                dataItems);


            mainElement.ElementList.Add(dataElement);

            mainElement = await core.TemplateUploadData(mainElement);
            return await core.TemplateCreate(mainElement);
        }
    }
}