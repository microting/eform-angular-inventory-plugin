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

namespace Inventory.Pn.Services.RebusService
{
    using Castle.MicroKernel.Registration;
    using Castle.Windsor;
    using eFormCore;
    using Installers;
    using Microting.eFormApi.BasePn.Abstractions;
    using Microting.eFormInventoryBase.Infrastructure.Data;
    using Microting.eFormInventoryBase.Infrastructure.Data.Factories;
    using Rebus.Bus;
    using System.Threading.Tasks;

    public class RebusService : IRebusService
    {
        private IBus _bus;
        private IWindsorContainer _container;
        private string _connectionString;
        private readonly IEFormCoreService _coreHelper;

        public RebusService(IEFormCoreService coreHelper)
        {
            //_dbContext = dbContext;
            _coreHelper = coreHelper;
        }

        public async Task Start(string connectionString)
        {
            _connectionString = connectionString;
            _container = new WindsorContainer();
            _container.Install(
                new RebusHandlerInstaller()
                , new RebusInstaller(connectionString, 1, 1)
            );

            var core = await _coreHelper.GetCore();
            _container.Register(Component.For<Core>().Instance(core));
            _container.Register(Component.For<InventoryPnDbContext>().Instance(GetContext()));
            _bus = _container.Resolve<IBus>();
        }

        public IBus GetBus()
        {
            return _bus;
        }
        private InventoryPnDbContext GetContext()
        {
            var contextFactory = new InventoryPnContextFactory();
            return contextFactory.CreateDbContext(new[] {_connectionString});
        }
    }
}