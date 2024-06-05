using Microsoft.EntityFrameworkCore;
using SistemaDeVentasCafe.Models;
using SistemaDeVentasCafe.Repository.IRepository;

namespace SistemaDeVentasCafe.Repository
{
    public class RepositoryFactura : IRepositoryGeneric<Factura>
    {
        private readonly DbapiContext _context;
        public RepositoryFactura(DbapiContext context)
        {
            _context = context;
        }

        public async Task<Factura?> ObtenerPorId(int id) => await _context.Facturas.FindAsync(id);

        public async Task<List<Factura>> ListarTodos() => await _context.Facturas.AsNoTracking().Include(f => f.fCliente).Include(f => f.Lista_De_Productos).ToListAsync();

        public async Task Crear(Factura cliente) => await _context.Facturas.AddAsync(cliente);

        public async Task Eliminar(Factura cliente) => _context.Facturas.Remove(cliente);

        public async Task Actualizar(Factura cliente) => _context.Update(cliente);
    }
}
