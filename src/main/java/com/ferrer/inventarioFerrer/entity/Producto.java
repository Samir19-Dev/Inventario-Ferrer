package com.ferrer.inventarioFerrer.entity;

import java.math.BigDecimal;
import jakarta.persistence.*;

@Entity
@Table(name = "productos")
public class Producto {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, length = 150)
	private String nombre;

	@Column(length = 255)
	private String descripcion;

	@Column(name = "codigo_barras", unique = true, length = 100)
	private String codigoBarras;

	@Column(name = "precio_compra", nullable = false, precision = 10, scale = 2)
	private BigDecimal precioCompra;

	@Column(name = "precio_venta", nullable = false, precision = 10, scale = 2)
	private BigDecimal precioVenta;

	@Column(nullable = false)
	private Integer stock = 0;

	@Column(name = "stock_minimo", nullable = false)
	private Integer stockMinimo = 5;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "categoria_id")
	private Categoria categoria;

	public Producto() {
	}

	public Long getId() {
		return id;
	}

	public String getNombre() {
		return nombre;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public String getCodigoBarras() {
		return codigoBarras;
	}

	public BigDecimal getPrecioCompra() {
		return precioCompra;
	}

	public BigDecimal getPrecioVenta() {
		return precioVenta;
	}

	public Integer getStock() {
		return stock;
	}

	public Integer getStockMinimo() {
		return stockMinimo;
	}

	public Categoria getCategoria() {
		return categoria;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	public void setCodigoBarras(String codigoBarras) {
		this.codigoBarras = codigoBarras;
	}

	public void setPrecioCompra(BigDecimal precioCompra) {
		this.precioCompra = precioCompra;
	}

	public void setPrecioVenta(BigDecimal precioVenta) {
		this.precioVenta = precioVenta;
	}

	public void setStock(Integer stock) {
		this.stock = stock;
	}

	public void setStockMinimo(Integer stockMinimo) {
		this.stockMinimo = stockMinimo;
	}

	public void setCategoria(Categoria categoria) {
		this.categoria = categoria;
	}
}