using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SistemaDeVentasCafe.CodigoRepetido;
using SistemaDeVentasCafe.DTOs;
using SistemaDeVentasCafe.Models;
using SistemaDeVentasCafe.Service.IService;
using SistemaDeVentasCafe.UnitOfWork;
using iTextSharp.text.pdf;
using iTextSharp.text;

namespace SistemaDeVentasCafe.Service
{
    public class ServiceFactura : IServiceFactura
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly APIResponse _apiresponse;
        private readonly ILogger<ServiceFactura> _logger;

        public ServiceFactura(IMapper mapper, APIResponse apiresponse, ILogger<ServiceFactura> logger, IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _apiresponse = apiresponse;
            _logger = logger;
            _unitOfWork = unitOfWork;
        }

        public async Task<APIResponse> Listar()
        {
            try
            {
                List<Factura> lista = await _unitOfWork.repositoryFactura.ListarTodos();
                if (lista.Count == 0)
                {
                    _logger.LogError("La lista de facturas esta vacia.");
                    return Utilidades.NotFoundResponse(_apiresponse);
                }
                _logger.LogInformation("Lista de facturas traida con exito.");
                return Utilidades.ListOKResponse(lista, _apiresponse);
            }
            catch (Exception ex)
            {
                return Utilidades.ErrorHandling(ex, _apiresponse, _logger);
            }
        }

        public async Task<APIResponse> ObtenerPorId(int id)
        {
            try
            {
                var factura = await _unitOfWork.repositoryFactura.ObtenerPorId(id);
                if (factura == null)
                {
                    _logger.LogError("No existe factura con ese id.");
                    return Utilidades.NotFoundResponse(_apiresponse);
                }
                _logger.LogInformation("Factura traida con exito.");
                return Utilidades.OKResponse(_mapper.Map<FacturaGetDto>(factura), _apiresponse);
            }
            catch (Exception ex)
            {
                return Utilidades.ErrorHandling(ex, _apiresponse, _logger);
            }
        }

        public async Task<APIResponse> Crear([FromBody] FacturaCreateDto facturaCreateDto) //arrgle + ahora funciona con stock
        {
            try
            {
                var factura = _mapper.Map<Factura>(facturaCreateDto);
                String listaprod = "";
                decimal? precioFinal = 0;
                List<Producto> productosFinales = new List<Producto>(); 
                var cliente = await _unitOfWork.repositoryCliente.ObtenerPorId(factura.IdCliente);
                if (cliente == null)
                {
                    _logger.LogError("No existe cliente con ese id.");
                    return Utilidades.NotFoundResponse(_apiresponse);
                }
                if (factura.Lista_De_Productos.Count == 0)
                {
                    _logger.LogError("La lista de productos enviada esta vacia.");
                    return Utilidades.NotFoundResponse(_apiresponse);
                }
                foreach (Facturaproducto prod in factura.Lista_De_Productos)
                {
                    var producto = await _unitOfWork.repositoryProducto.ObtenerPorId(prod.IdProducto);
                    if (producto == null || producto.StockActual < prod.CantidadDelProducto) //si el stock es insuficiente
                    {
                        if (producto == null)
                        {
                            _logger.LogError("Un producto de la lista enviada no existe. Verificar los Ids enviados");

                        }
                        else
                        {
                            _logger.LogError("La cantidad de stock de " + producto.Descripcion + " es insuficiente.");
                        }
                        return Utilidades.ConflictedResponse(_apiresponse);
                    }
                    precioFinal += producto.PrecioVenta * prod.CantidadDelProducto; //precio final
                    producto.StockActual -= prod.CantidadDelProducto; //actualizo stock
                    await _unitOfWork.repositoryProducto.Actualizar(producto);
                    productosFinales.Add(producto);
                    listaprod += producto.Descripcion + ", Cantidad: " + prod.CantidadDelProducto + ".";
                }
                factura.CantidadProductos = productosFinales.Count();
                factura.Descripcion = listaprod;
                factura.PrecioTotal = precioFinal;
                factura.EstadoPago = false;
                factura.FechaFactura = DateOnly.FromDateTime(DateTime.Now); //el momento de generar la factura
                await _unitOfWork.repositoryFactura.Crear(factura);
                await _unitOfWork.Save();
                _logger.LogInformation("Factura creada con exito.");
                return Utilidades.CreatedResponse(_apiresponse);
            }
            catch (Exception ex)
            {
                return Utilidades.ErrorHandling(ex, _apiresponse, _logger);
            }
        }

        public async Task<APIResponse> Imprimir(int id)
        {
            try
            {
                var Factura = await _unitOfWork.repositoryFactura.ObtenerPorId(id);
                if (Factura == null)
                {
                    _logger.LogError("No existe factura con ese id.");
                    return Utilidades.NotFoundResponse(_apiresponse);
                }
                _logger.LogInformation("Factura traida con exito.");
                var listaProductos = await _unitOfWork.repositoryFacturaProducto.ListarTodos();
                listaProductos = listaProductos.ToList();
                //Creacion del PDF.
                string logpath = @"C:\Users\" + Environment.UserName + @"\Downloads\factura" + Factura.IdFactura.ToString() + ".pdf";
                iTextSharp.text.Document doc = new iTextSharp.text.Document();
                PdfWriter.GetInstance(doc, new FileStream(logpath, FileMode.Create));
                doc.Open();
                doc.Add(new Paragraph(Factura.ToString()));
                doc.Close();
                return Utilidades.CreatedResponse(_apiresponse); //puse created para q no muestre los datos el swgger.
                    
            }
            catch (Exception ex)
            {
                return Utilidades.ErrorHandling(ex, _apiresponse, _logger);
            }
        }
    }
}
