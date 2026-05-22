package com.ferrer.inventarioFerrer.DTO;

import java.math.BigDecimal;

public class DetalleVentaResponseDTO {

	private Long id;
	private Long productoId;
	private String productoNombre;
	private Integer cantidad;
	private BigDecimal precioUnitario;
	private BigDecimal subtotal;

	public DetalleVentaResponseDTO() {
	}

	public DetalleVentaResponseDTO(Long id, Long productoId, String productoNombre, Integer cantidad,
			BigDecimal precioUnitario, BigDecimal subtotal) {
		this.id = id;
		this.productoId = productoId;
		this.productoNombre = productoNombre;
		this.cantidad = cantidad;
		this.precioUnitario = precioUnitario;
		this.subtotal = subtotal;
	}

	public Long getId() {
		return id;
	}

	public Long getProductoId() {
		return productoId;
	}

	public String getProductoNombre() {
		return productoNombre;
	}

	public Integer getCantidad() {
		return cantidad;
	}

	public BigDecimal getPrecioUnitario() {
		return precioUnitario;
	}

	public BigDecimal getSubtotal() {
		return subtotal;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public void setProductoId(Long productoId) {
		this.productoId = productoId;
	}

	public void setProductoNombre(String productoNombre) {
		this.productoNombre = productoNombre;
	}

	public void setCantidad(Integer cantidad) {
		this.cantidad = cantidad;
	}

	public void setPrecioUnitario(BigDecimal precioUnitario) {
		this.precioUnitario = precioUnitario;
	}

	public void setSubtotal(BigDecimal subtotal) {
		this.subtotal = subtotal;
	}
}