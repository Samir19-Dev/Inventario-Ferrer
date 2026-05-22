package com.ferrer.inventarioFerrer.DTO;

import java.math.BigDecimal;

public class ProductoResponseDTO {

	private Long id;
	private String nombre;
	private String descripcion;
	private String codigoBarras;
	private BigDecimal precioCompra;
	private BigDecimal precioVenta;
	private Integer stock;
	private Integer stockMinimo;
	private Long categoriaId;
	private String categoriaNombre;

	public ProductoResponseDTO() {
	}

	public ProductoResponseDTO(Long id, String nombre, String descripcion, String codigoBarras, BigDecimal precioCompra,
			BigDecimal precioVenta, Integer stock, Integer stockMinimo, Long categoriaId, String categoriaNombre) {
		this.id = id;
		this.nombre = nombre;
		this.descripcion = descripcion;
		this.codigoBarras = codigoBarras;
		this.precioCompra = precioCompra;
		this.precioVenta = precioVenta;
		this.stock = stock;
		this.stockMinimo = stockMinimo;
		this.categoriaId = categoriaId;
		this.categoriaNombre = categoriaNombre;
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

	public Long getCategoriaId() {
		return categoriaId;
	}

	public String getCategoriaNombre() {
		return categoriaNombre;
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

	public void setCategoriaId(Long categoriaId) {
		this.categoriaId = categoriaId;
	}

	public void setCategoriaNombre(String categoriaNombre) {
		this.categoriaNombre = categoriaNombre;
	}
}
