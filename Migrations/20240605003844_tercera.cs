using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SistemaDeVentasCafe.Migrations
{
    /// <inheritdoc />
    public partial class tercera : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            

            migrationBuilder.CreateTable(
                name: "MEDIODEPAGO",
                columns: table => new
                {
                    IdMedioDePago = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    descripcion = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__MEDIODEP__6B4A4BA22B848B08", x => x.IdMedioDePago);
                });

            migrationBuilder.CreateTable(
                name: "COBRANZA",
                columns: table => new
                {
                    IdCobranza = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Descripcion = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    Importe = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    fechaDeCobro = table.Column<DateOnly>(type: "date", nullable: true),
                    NumeroFactura = table.Column<int>(type: "int", nullable: true),
                    MedioDePago = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__COBRANZA__7B29BE86A8CEAEB7", x => x.IdCobranza);
                    table.ForeignKey(
                        name: "FK_MEDIODEPAGO",
                        column: x => x.MedioDePago,
                        principalTable: "MEDIODEPAGO",
                        principalColumn: "IdMedioDePago");
                    table.ForeignKey(
                        name: "FK_NUMEROFACTURA",
                        column: x => x.NumeroFactura,
                        principalTable: "FACTURA",
                        principalColumn: "IdFactura");
                });

            migrationBuilder.CreateIndex(
                name: "IX_COBRANZA_MedioDePago",
                table: "COBRANZA",
                column: "MedioDePago");

            migrationBuilder.CreateIndex(
                name: "IX_COBRANZA_NumeroFactura",
                table: "COBRANZA",
                column: "NumeroFactura");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_IDCLIENTE",
                table: "FACTURA");

            migrationBuilder.DropForeignKey(
                name: "FK_IDFACTURA",
                table: "FACTURAPRODUCTOS");

            migrationBuilder.DropForeignKey(
                name: "FK_IDPRODUCTO",
                table: "FACTURAPRODUCTOS");

            migrationBuilder.DropTable(
                name: "COBRANZA");

            migrationBuilder.DropTable(
                name: "MEDIODEPAGO");

            migrationBuilder.AlterColumn<int>(
                name: "IdProducto",
                table: "FACTURAPRODUCTOS",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "IdFactura",
                table: "FACTURAPRODUCTOS",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "CantidadDelProducto",
                table: "FACTURAPRODUCTOS",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "IdCliente",
                table: "FACTURA",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_IDCLIENTE",
                table: "FACTURA",
                column: "IdCliente",
                principalTable: "CLIENTE",
                principalColumn: "IdCliente");

            migrationBuilder.AddForeignKey(
                name: "FK_IDFACTURA",
                table: "FACTURAPRODUCTOS",
                column: "IdFactura",
                principalTable: "FACTURA",
                principalColumn: "IdFactura");

            migrationBuilder.AddForeignKey(
                name: "FK_IDPRODUCTO",
                table: "FACTURAPRODUCTOS",
                column: "IdProducto",
                principalTable: "PRODUCTO",
                principalColumn: "IdProducto");
        }
    }
}
