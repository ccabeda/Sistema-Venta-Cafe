using SistemaDeVentasCafe.Models;
using SistemaDeVentasCafe.Repository.IRepository;

namespace SistemaDeVentasCafe.UnitOfWork
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DbapiContext _context;
        public IRepositoryGeneric<Cliente> repositoryCliente { get; }
        public IRepositoryGeneric<Producto> repositoryProducto { get; }
        public IRepositoryGeneric<Factura> repositoryFactura { get; }
        public IRepositoryGeneric<Cobranza> repositoryCobranza { get; }
        public IRepositoryFacturaProducto repositoryFacturaProducto { get; }
        public IRepositoryMedioDePago repositoryMedioDePago { get; }

        public UnitOfWork(DbapiContext context, IRepositoryGeneric<Cliente> _repositoryCliente, IRepositoryGeneric<Producto> _repositoryProducto, IRepositoryGeneric<Factura> _repositoryFactura,
               IRepositoryFacturaProducto _repositoryFacturaProducto, IRepositoryGeneric<Cobranza> _repositoryCobranza, IRepositoryMedioDePago _repositoryMedioDePago)
        {
            _context = context;
            repositoryCliente = _repositoryCliente;
            repositoryProducto = _repositoryProducto;
            repositoryFactura = _repositoryFactura;
            repositoryFacturaProducto = _repositoryFacturaProducto;
            repositoryCobranza = _repositoryCobranza;
            repositoryMedioDePago = _repositoryMedioDePago;
        }
        public async Task Save() => await _context.SaveChangesAsync();
    }
}
