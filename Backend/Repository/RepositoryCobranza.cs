using Microsoft.EntityFrameworkCore;
using SistemaDeVentasCafe.Models;
using SistemaDeVentasCafe.Repository.IRepository;

namespace SistemaDeVentasCafe.Repository
{
    public class RepositoryCobranza : IRepositoryGeneric<Cobranza>
    {
        private readonly DbapiContext _context;

        public RepositoryCobranza(DbapiContext context)
        {
            _context = context;
        }

        public async Task<Cobranza?> ObtenerPorId(int id) => await _context.Cobranzas.FindAsync(id);

        public async Task<List<Cobranza>> ListarTodos() => await _context.Cobranzas.AsNoTracking().ToListAsync();

        public async Task Crear(Cobranza cliente) => await _context.Cobranzas.AddAsync(cliente);

        public async Task Eliminar(Cobranza cliente) => _context.Cobranzas.Remove(cliente);

        public async Task Actualizar(Cobranza cliente) => _context.Update(cliente);
    }
}
