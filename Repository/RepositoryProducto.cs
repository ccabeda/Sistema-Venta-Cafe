using Microsoft.EntityFrameworkCore;
using SistemaDeVentasCafe.Models;
using SistemaDeVentasCafe.Repository.IRepository;

namespace SistemaDeVentasCafe.Repository
{
    public class RepositoryProducto : IRepositoryGeneric<Producto>
    {
        private readonly DbapiContext _context;
        public RepositoryProducto(DbapiContext context)
        {
            _context = context;
        }

        public async Task<Producto?> ObtenerPorId(int id) => await _context.Productos.FindAsync(id);

        public async Task<List<Producto>> ListarTodos() => await _context.Productos.AsNoTracking().ToListAsync();

        public async Task Crear(Producto cliente) => await _context.Productos.AddAsync(cliente);

        public async Task Eliminar(Producto cliente) => _context.Productos.Remove(cliente);

        public async Task Actualizar(Producto cliente) => _context.Update(cliente);
    }
}
