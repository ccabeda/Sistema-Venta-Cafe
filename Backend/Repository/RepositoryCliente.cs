using Microsoft.EntityFrameworkCore;
using SistemaDeVentasCafe.Models;
using SistemaDeVentasCafe.Repository.IRepository;

namespace SistemaDeVentasCafe.Repository
{
    public class RepositoryCliente : IRepositoryGeneric<Cliente>
    {
        private readonly DbapiContext _context;

        public RepositoryCliente(DbapiContext context)
        {
            _context = context;
        }

        public async Task<Cliente?> ObtenerPorId(int id) => await _context.Clientes.FindAsync(id);

        public async Task<List<Cliente>> ListarTodos() => await _context.Clientes.AsNoTracking().ToListAsync();

        public async Task Crear(Cliente cliente) => await _context.Clientes.AddAsync(cliente);

        public async Task Eliminar(Cliente cliente) => _context.Clientes.Remove(cliente);

        public async Task Actualizar(Cliente cliente) => _context.Update(cliente);
    }
}
