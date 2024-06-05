using Microsoft.EntityFrameworkCore;
using SistemaDeVentasCafe.Models;
using SistemaDeVentasCafe.Repository.IRepository;

namespace SistemaDeVentasCafe.Repository
{
    public class RepositoryFacturaProducto : IRepositoryFacturaProducto
    {
        private readonly DbapiContext _context;
        public RepositoryFacturaProducto(DbapiContext context)
        {
            _context = context;
        }
        public async Task<List<Facturaproducto>> ListarTodos() => await _context.Facturaproductos.ToListAsync(); //que lo trakee asi lo guarda
    }
}
