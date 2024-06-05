namespace SistemaDeVentasCafe.Repository.IRepository
{
    public interface IRepositoryGeneric<T> where T : class
    {
        Task<T?> ObtenerPorId(int id);
        Task<List<T>> ListarTodos();
        Task Crear(T entity);
        Task Actualizar(T entity);
        Task Eliminar(T entity);
    }
}
