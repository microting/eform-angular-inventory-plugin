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


namespace Inventory.Pn
{
    using Infrastructure.Data.Seed;
    using Infrastructure.Data.Seed.Data;
    using Infrastructure.Models.Settings;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microting.eFormApi.BasePn;
    using Microting.eFormApi.BasePn.Infrastructure.Consts;
    using Microting.eFormApi.BasePn.Infrastructure.Database.Extensions;
    using Microting.eFormApi.BasePn.Infrastructure.Helpers;
    using Microting.eFormApi.BasePn.Infrastructure.Models.Application;
    using Microting.eFormApi.BasePn.Infrastructure.Models.Application.NavigationMenu;
    using Microting.eFormApi.BasePn.Infrastructure.Settings;
    using Microting.eFormInventoryBase.Infrastructure.Const;
    using Microting.eFormInventoryBase.Infrastructure.Data;
    using Microting.eFormInventoryBase.Infrastructure.Data.Factories;
    using Services.InventoryItemGroupService;
    using Services.InventoryItemService;
    using Services.InventoryItemTypeService;
    using Services.InventoryLocalizationService;
    using Services.InventoryPnSettingsService;
    using Services.InventoryTagsService;
    using Services.RebusService;
    using System;
    using System.Collections.Generic;
    using System.Reflection;
    using eFormCore;
    using Microting.eFormApi.BasePn.Abstractions;
    using Microting.eFormApi.BasePn.Infrastructure.Helpers.PluginDbOptions;
    using Services.UploadedDataService;

    public class EformInventoryPlugin : IEformPlugin
    {
        public string Name => "Microting Inventory Plugin";

        public string PluginId => "eform-angular-inventory-plugin";

        public string PluginPath => PluginAssembly().Location;

        public string PluginBaseUrl => "inventory-pn";


        private string _connectionString;

        public Assembly PluginAssembly()
        {
            return typeof(EformInventoryPlugin).GetTypeInfo().Assembly;
        }

        public void Configure(IApplicationBuilder appBuilder)
        {
            var serviceProvider = appBuilder.ApplicationServices;
            var rebusService = serviceProvider.GetService<IRebusService>();
            rebusService.Start(_connectionString);

            rebusService.GetBus();
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton<IInventoryLocalizationService, InventoryLocalizationService>();
            services.AddTransient<IInventoryPnSettingsService, InventoryPnSettingsService>();
            services.AddTransient<IInventoryItemGroupService, InventoryItemGroupService>();
            services.AddTransient<IInventoryItemTypeService, InventoryItemTypeService>();
            services.AddTransient<IInventoryItemService, InventoryItemService>();
            services.AddTransient<IInventoryTagsService, InventoryTagsService>();
            services.AddTransient<IUploadedDataService, UploadedDataService>();
            services.AddSingleton<IRebusService, RebusService>();
            services.AddControllers();

            SeedInventoryItemsForms(services);
        }

        private async void SeedInventoryItemsForms(IServiceCollection services)
        {
            var serviceProvider = services.BuildServiceProvider();
            var pluginDbOptions =
                serviceProvider.GetRequiredService<IPluginDbOptions<InventoryBaseSettings>>();

            var core = await serviceProvider.GetRequiredService<IEFormCoreService>().GetCore();
            var context = serviceProvider.GetRequiredService<InventoryPnDbContext>();

            if (pluginDbOptions.Value.InventoryFormId == 0)
            {
                var taskListId = await SeedEForm.CreateEform(core);
                await pluginDbOptions.UpdateDb(settings => settings.InventoryFormId = taskListId, context, 1);
            }
        }

        public void ConfigureOptionsServices(IServiceCollection services, IConfiguration configuration)
        {
            services.ConfigurePluginDbOptions<InventoryBaseSettings>(
                configuration.GetSection("InventoryBaseSettings"));
        }

        public void ConfigureDbContext(IServiceCollection services, string connectionString)
        {
            _connectionString = connectionString;
            if (connectionString.ToLower().Contains("convert zero datetime"))
            {
                services.AddDbContext<InventoryPnDbContext>(o => o.UseMySql(connectionString,
                    b => b.MigrationsAssembly(PluginAssembly().FullName).EnableRetryOnFailure()));
            }
            else
            {
                services.AddDbContext<InventoryPnDbContext>(o => o.UseSqlServer(connectionString,
                    b => b.MigrationsAssembly(PluginAssembly().FullName)));
            }

            var contextFactory = new InventoryPnContextFactory();
            var context = contextFactory.CreateDbContext(new[] { connectionString });
            context.Database.Migrate();

            // Seed database
            SeedDatabase(connectionString);
        }

        public MenuModel HeaderMenu(IServiceProvider serviceProvider)
        {
            var localizationService = serviceProvider
                .GetService<IInventoryLocalizationService>();

            var result = new MenuModel();
            result.LeftMenu.Add(new MenuItemModel
            {
                Name = localizationService.GetString("Inventory"),
                E2EId = "inventory-pn",
                Link = "",
                Guards = new List<string> { InventoryClaims.AccessInventoryPlugin },
                MenuItems = new List<MenuItemModel>
                {
                    new MenuItemModel
                    {
                        Name = localizationService.GetString("Inventory"),
                        E2EId = "inventory-pn-items",
                        Link = "/plugins/inventory-pn/items",
                        Guards = new List<string> { InventoryClaims.GetInventory },
                        Position = 0,
                    },
                },
            });
            return result;
        }

        public List<PluginMenuItemModel> GetNavigationMenu(IServiceProvider serviceProvider)
        {
            var pluginMenu = new List<PluginMenuItemModel>
                {
                    new PluginMenuItemModel
                    {
                        Name = "Dropdown",
                        E2EId = "inventory-pn",
                        Link = "",
                        Type = MenuItemTypeEnum.Dropdown,
                        Position = 0,
                        Translations = new List<PluginMenuTranslationModel>
                        {
                            new PluginMenuTranslationModel
                            {
                                 LocaleName = LocaleNames.English,
                                 Name = "Inventory",
                                 Language = LanguageNames.English,
                            },
                            new PluginMenuTranslationModel
                            {
                                 LocaleName = LocaleNames.German,
                                 Name = "Inventar",
                                 Language = LanguageNames.German,
                            },
                            new PluginMenuTranslationModel
                            {
                                 LocaleName = LocaleNames.Danish,
                                 Name = "Opgørelse",
                                 Language = LanguageNames.Danish,
                            },
                        },
                        ChildItems = new List<PluginMenuItemModel>
                        {
                            new PluginMenuItemModel
                            {
                                Name = "Items",
                                E2EId = "inventory-pn-items",
                                Link = "/plugins/inventory-pn/items",
                                Type = MenuItemTypeEnum.Link,
                                Position = 0,
                                MenuTemplate = new PluginMenuTemplateModel()
                                {
                                    Name = "Items",
                                    E2EId = "inventory-pn-items",
                                    DefaultLink = "/plugins/inventory-pn/items",
                                    Permissions = new List<PluginMenuTemplatePermissionModel>()
                                    {
                                        new PluginMenuTemplatePermissionModel
                                        {
                                            ClaimName = InventoryClaims.GetInventory,
                                            PermissionName = "Obtain inventory",
                                            PermissionTypeName = "Inventory",
                                        },
                                    },
                                    Translations = new List<PluginMenuTranslationModel>
                                    {
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.English,
                                            Name = "Items",
                                            Language = LanguageNames.English,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.German,
                                            Name = "Gegenst",
                                            Language = LanguageNames.German,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.Danish,
                                            Name = "Element",
                                            Language = LanguageNames.Danish,
                                        },
                                    }
                                },
                                Translations = new List<PluginMenuTranslationModel>
                                {
                                    new PluginMenuTranslationModel
                                    {
                                        LocaleName = LocaleNames.English,
                                        Name = "Items",
                                        Language = LanguageNames.English,
                                    },
                                    new PluginMenuTranslationModel
                                    {
                                        LocaleName = LocaleNames.German,
                                        Name = "Gegenst",
                                        Language = LanguageNames.German,
                                    },
                                    new PluginMenuTranslationModel
                                    {
                                        LocaleName = LocaleNames.Danish,
                                        Name = "Element",
                                        Language = LanguageNames.Danish,
                                    },
                                }
                            },
                            new PluginMenuItemModel
                            {
                                Name = "Item types",
                                E2EId = "inventory-pn-item-types",
                                Link = "/plugins/inventory-pn/item-types",
                                Type = MenuItemTypeEnum.Link,
                                Position = 1,
                                MenuTemplate = new PluginMenuTemplateModel()
                                {
                                    Name = "Item types",
                                    E2EId = "inventory-pn-item-types",
                                    DefaultLink = "/plugins/inventory-pn/item-types",
                                    Permissions = new List<PluginMenuTemplatePermissionModel>(),
                                    Translations = new List<PluginMenuTranslationModel>
                                    {
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.English,
                                            Name = "Item types",
                                            Language = LanguageNames.English,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.German,
                                            Name = "Elementtypen",
                                            Language = LanguageNames.German,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.Danish,
                                            Name = "Elementtype",
                                            Language = LanguageNames.Danish,
                                        },
                                    }
                                },
                                Translations = new List<PluginMenuTranslationModel>
                                {
                                    new PluginMenuTranslationModel
                                    {
                                        LocaleName = LocaleNames.English,
                                        Name = "Item types",
                                        Language = LanguageNames.English,
                                    },
                                    new PluginMenuTranslationModel
                                    {
                                        LocaleName = LocaleNames.German,
                                        Name = "Elementtypen",
                                        Language = LanguageNames.German,
                                    },
                                    new PluginMenuTranslationModel
                                    {
                                        LocaleName = LocaleNames.Danish,
                                        Name = "Elementtype",
                                        Language = LanguageNames.Danish,
                                    },
                                }
                            },
                            new PluginMenuItemModel
                            {
                                Name = "Item groups",
                                E2EId = "inventory-pn-item-groups",
                                Link = "/plugins/inventory-pn/item-groups",
                                Type = MenuItemTypeEnum.Link,
                                Position = 2,
                                MenuTemplate = new PluginMenuTemplateModel()
                                {
                                    Name = "Item groups",
                                    E2EId = "inventory-pn-item-groups",
                                    DefaultLink = "/plugins/inventory-pn/item-groups",
                                    Permissions = new List<PluginMenuTemplatePermissionModel>(),
                                    Translations = new List<PluginMenuTranslationModel>
                                    {
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.English,
                                            Name = "Item groups",
                                            Language = LanguageNames.English,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.German,
                                            Name = "Artikel-Gruppen",
                                            Language = LanguageNames.German,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.Danish,
                                            Name = "Varegrupper",
                                            Language = LanguageNames.Danish,
                                        },
                                    }
                                },
                                Translations = new List<PluginMenuTranslationModel>
                                    {
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.English,
                                            Name = "Item groups",
                                            Language = LanguageNames.English,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.German,
                                            Name = "Artikel-Gruppen",
                                            Language = LanguageNames.German,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.Danish,
                                            Name = "Varegrupper",
                                            Language = LanguageNames.Danish,
                                        },
                                    }
                            },
                        }
                    }
                };

            return pluginMenu;
        }

        public void SeedDatabase(string connectionString)
        {
            // Get DbContext
            var contextFactory = new InventoryPnContextFactory();
            using var context = contextFactory.CreateDbContext(new[] { connectionString });

            // Seed configuration
            InventoryPluginSeed.SeedData(context);
        }

        public void AddPluginConfig(IConfigurationBuilder builder, string connectionString)
        {
            var seedData = new InventoryConfigurationSeedData();
            var contextFactory = new InventoryPnContextFactory();
            builder.AddPluginConfiguration(
                connectionString,
                seedData,
                contextFactory);
        }

        public PluginPermissionsManager GetPermissionsManager(string connectionString)
        {
            var contextFactory = new InventoryPnContextFactory();
            var context = contextFactory.CreateDbContext(new[] { connectionString });

            return new PluginPermissionsManager(context);
        }

    }
}
