using SistemaDeVentasCafe.Models;
using SistemaDeVentasCafe.Repository.IRepository;

namespace SistemaDeVentasCafe.Repository
{
    public class RepositoryMedioDePago : IRepositoryMedioDePago
    {
        private readonly DbapiContext _context;
        public RepositoryMedioDePago(DbapiContext context)
        {
            _context = context;
        }

        public async Task Crear(Mediodepago medioDePago) => await _context.Mediodepagos.AddAsync(medioDePago);

        public async Task<Mediodepago?> ObtenerPorId(int id) => await _context.Mediodepagos.FindAsync(id);
    }
}
