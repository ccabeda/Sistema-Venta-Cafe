using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SistemaDeVentasCafe.Migrations
{
    /// <inheritdoc />
    public partial class segundaMigracion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "FACTURA",
                columns: table => new
                {
                    IdFactura = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FechaFactura = table.Column<DateOnly>(type: "date", nullable: true),
                    CantidadProductos = table.Column<int>(type: "int", nullable: true),
                    Descripcion = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    PrecioTotal = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    IdCliente = table.Column<int>(type: "int", nullable: true),
                    EstadoPago = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__FACTURA__50E7BAF1153F5D44", x => x.IdFactura);
                    table.ForeignKey(
                        name: "FK_IDCLIENTE",
                        column: x => x.IdCliente,
                        principalTable: "CLIENTE",
                        principalColumn: "IdCliente");
                });

            migrationBuilder.CreateTable(
                name: "FACTURAPRODUCTOS",
                columns: table => new
                {
                    IdFacturaProductos = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CantidadDelProducto = table.Column<int>(type: "int", nullable: false),
                    IdFactura = table.Column<int>(type: "int", nullable: true),
                    IdProducto = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__FACTURAP__36F787A4DE48DE03", x => x.IdFacturaProductos);
                    table.ForeignKey(
                        name: "FK_IDFACTURA",
                        column: x => x.IdFactura,
                        principalTable: "FACTURA",
                        principalColumn: "IdFactura");
                    table.ForeignKey(
                        name: "FK_IDPRODUCTO",
                        column: x => x.IdProducto,
                        principalTable: "PRODUCTO",
                        principalColumn: "IdProducto");
                });

            migrationBuilder.CreateIndex(
                name: "IX_FACTURA_IdCliente",
                table: "FACTURA",
                column: "IdCliente");

            migrationBuilder.CreateIndex(
                name: "IX_FACTURAPRODUCTOS_IdFactura",
                table: "FACTURAPRODUCTOS",
                column: "IdFactura");

            migrationBuilder.CreateIndex(
                name: "IX_FACTURAPRODUCTOS_IdProducto",
                table: "FACTURAPRODUCTOS",
                column: "IdProducto");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FACTURAPRODUCTOS");

            migrationBuilder.DropTable(
                name: "FACTURA");

            migrationBuilder.DropTable(
                name: "PRODUCTO");

            migrationBuilder.DropTable(
                name: "CLIENTE");
        }
    }
}
