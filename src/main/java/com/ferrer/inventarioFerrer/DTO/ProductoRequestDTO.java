package com.ferrer.inventarioFerrer.DTO;

import java.math.BigDecimal;

public class ProductoRequestDTO {

	private String nombre;
	private String descripcion;
	private String codigoBarras;
	private BigDecimal precioCompra;
	private BigDecimal precioVenta;
	private Integer stock;
	private Integer stockMinimo;
	private Long categoriaId;

	public ProductoRequestDTO() {
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
}
