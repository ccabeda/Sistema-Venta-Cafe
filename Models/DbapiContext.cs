using Microsoft.EntityFrameworkCore;

namespace SistemaDeVentasCafe.Models;

public partial class DbapiContext : DbContext
{
    public DbapiContext()
    {
    }

    public DbapiContext(DbContextOptions<DbapiContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Cliente> Clientes { get; set; }
    public virtual DbSet<Cobranza> Cobranzas { get; set; }
    public virtual DbSet<Factura> Facturas { get; set; }
    public virtual DbSet<Facturaproducto> Facturaproductos { get; set; }
    public virtual DbSet<Mediodepago> Mediodepagos { get; set; }
    public virtual DbSet<Producto> Productos { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) 
    { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        //ModelBuilder Cliente
        modelBuilder.Entity<Cliente>(entity =>
        {
            entity.HasKey(e => e.IdCliente).HasName("PK__CLIENTE__D59466421629B4E8");

            entity.ToTable("CLIENTE");

            entity.Property(e => e.Apellido)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.CorreoElectronico)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Dni).HasColumnName("DNI");
            entity.Property(e => e.Nombre)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        //ModeBuilder Cobranza
        modelBuilder.Entity<Cobranza>(entity =>
        {
            entity.HasKey(e => e.IdCobranza).HasName("PK__COBRANZA__7B29BE86A8CEAEB7");

            entity.ToTable("COBRANZA");

            entity.Property(e => e.Descripcion)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.FechaDeCobro).HasColumnName("fechaDeCobro");
            entity.Property(e => e.Importe).HasColumnType("decimal(10, 2)");

            entity.HasOne(d => d.MedioDePagoNavigation).WithMany(p => p.Cobranzas)
                .HasForeignKey(d => d.MedioDePago)
                .HasConstraintName("FK_MEDIODEPAGO");

            entity.HasOne(d => d.NumeroFacturaNavigation).WithMany(p => p.Cobranzas)
                .HasForeignKey(d => d.NumeroFactura)
                .HasConstraintName("FK_NUMEROFACTURA");
        });

        //ModelBuilder Factura
        modelBuilder.Entity<Factura>(entity =>
        {
            entity.HasKey(e => e.IdFactura).HasName("PK__FACTURA__50E7BAF1153F5D44");

            entity.ToTable("FACTURA");

            entity.Property(e => e.Descripcion)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.PrecioTotal).HasColumnType("decimal(10, 2)");

            entity.HasOne(d => d.fCliente).WithMany(p => p.Facturas)
                .HasForeignKey(d => d.IdCliente)
                .HasConstraintName("FK_IDCLIENTE");
        });

        //ModelBuilder Factura Productos
        modelBuilder.Entity<Facturaproducto>(entity =>
        {
            entity.HasKey(e => e.IdFacturaProductos).HasName("PK__FACTURAP__36F787A4DE48DE03");

            entity.ToTable("FACTURAPRODUCTOS");

            entity.HasOne(d => d.fFactura).WithMany(p => p.Lista_De_Productos)
                .HasForeignKey(d => d.IdFactura)
                .HasConstraintName("FK_IDFACTURA");

            entity.HasOne(d => d.fProducto).WithMany(p => p.Facturaproductos)
                .HasForeignKey(d => d.IdProducto)
                .HasConstraintName("FK_IDPRODUCTO");
        });

        //ModeBuilder Medio De Pago
        modelBuilder.Entity<Mediodepago>(entity =>
        {
            entity.HasKey(e => e.IdMedioDePago).HasName("PK__MEDIODEP__6B4A4BA22B848B08");

            entity.ToTable("MEDIODEPAGO");

            entity.Property(e => e.Descripcion)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("descripcion");
        });

        //ModeBuilder Producto
        modelBuilder.Entity<Producto>(entity =>
        {
            entity.HasKey(e => e.IdProducto).HasName("PK__PRODUCTO__0988921094777190");

            entity.ToTable("PRODUCTO");

            entity.Property(e => e.Descripcion)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.FechaVencimiento).HasColumnName("fechaVencimiento");
            entity.Property(e => e.PrecioVenta).HasColumnType("decimal(10, 2)");
        });
        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
