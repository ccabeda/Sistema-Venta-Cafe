using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SistemaDeVentasCafe.Migrations
{
    /// <inheritdoc />
    public partial class cambiosMetodoDePago : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MEDIODEPAGO",
                table: "COBRANZA");

            migrationBuilder.DropForeignKey(
                name: "FK_NUMEROFACTURA",
                table: "COBRANZA");

            migrationBuilder.AlterColumn<string>(
                name: "Descripcion",
                table: "PRODUCTO",
                type: "varchar(200)",
                unicode: false,
                maxLength: 200,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(50)",
                oldUnicode: false,
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "descripcion",
                table: "MEDIODEPAGO",
                type: "varchar(200)",
                unicode: false,
                maxLength: 200,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(50)",
                oldUnicode: false,
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Apellido",
                table: "MEDIODEPAGO",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CodigoDeSeguridad",
                table: "MEDIODEPAGO",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DireccionDeFacturacion",
                table: "MEDIODEPAGO",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "FechaDeCaducidad",
                table: "MEDIODEPAGO",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Localidad",
                table: "MEDIODEPAGO",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Nombre",
                table: "MEDIODEPAGO",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "NumeroDeTarjeta",
                table: "MEDIODEPAGO",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Pais",
                table: "MEDIODEPAGO",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Telefono",
                table: "MEDIODEPAGO",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Descripcion",
                table: "FACTURA",
                type: "varchar(200)",
                unicode: false,
                maxLength: 200,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(50)",
                oldUnicode: false,
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "NumeroFactura",
                table: "COBRANZA",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "MedioDePago",
                table: "COBRANZA",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Descripcion",
                table: "COBRANZA",
                type: "varchar(200)",
                unicode: false,
                maxLength: 200,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(50)",
                oldUnicode: false,
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_MEDIODEPAGO",
                table: "COBRANZA",
                column: "MedioDePago",
                principalTable: "MEDIODEPAGO",
                principalColumn: "IdMedioDePago",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_NUMEROFACTURA",
                table: "COBRANZA",
                column: "NumeroFactura",
                principalTable: "FACTURA",
                principalColumn: "IdFactura",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MEDIODEPAGO",
                table: "COBRANZA");

            migrationBuilder.DropForeignKey(
                name: "FK_NUMEROFACTURA",
                table: "COBRANZA");

            migrationBuilder.DropColumn(
                name: "Apellido",
                table: "MEDIODEPAGO");

            migrationBuilder.DropColumn(
                name: "CodigoDeSeguridad",
                table: "MEDIODEPAGO");

            migrationBuilder.DropColumn(
                name: "DireccionDeFacturacion",
                table: "MEDIODEPAGO");

            migrationBuilder.DropColumn(
                name: "FechaDeCaducidad",
                table: "MEDIODEPAGO");

            migrationBuilder.DropColumn(
                name: "Localidad",
                table: "MEDIODEPAGO");

            migrationBuilder.DropColumn(
                name: "Nombre",
                table: "MEDIODEPAGO");

            migrationBuilder.DropColumn(
                name: "NumeroDeTarjeta",
                table: "MEDIODEPAGO");

            migrationBuilder.DropColumn(
                name: "Pais",
                table: "MEDIODEPAGO");

            migrationBuilder.DropColumn(
                name: "Telefono",
                table: "MEDIODEPAGO");

            migrationBuilder.AlterColumn<string>(
                name: "Descripcion",
                table: "PRODUCTO",
                type: "varchar(50)",
                unicode: false,
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(200)",
                oldUnicode: false,
                oldMaxLength: 200,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "descripcion",
                table: "MEDIODEPAGO",
                type: "varchar(50)",
                unicode: false,
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(200)",
                oldUnicode: false,
                oldMaxLength: 200,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Descripcion",
                table: "FACTURA",
                type: "varchar(50)",
                unicode: false,
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(200)",
                oldUnicode: false,
                oldMaxLength: 200,
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "NumeroFactura",
                table: "COBRANZA",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "MedioDePago",
                table: "COBRANZA",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "Descripcion",
                table: "COBRANZA",
                type: "varchar(50)",
                unicode: false,
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(200)",
                oldUnicode: false,
                oldMaxLength: 200,
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_MEDIODEPAGO",
                table: "COBRANZA",
                column: "MedioDePago",
                principalTable: "MEDIODEPAGO",
                principalColumn: "IdMedioDePago");

            migrationBuilder.AddForeignKey(
                name: "FK_NUMEROFACTURA",
                table: "COBRANZA",
                column: "NumeroFactura",
                principalTable: "FACTURA",
                principalColumn: "IdFactura");
        }
    }
}
