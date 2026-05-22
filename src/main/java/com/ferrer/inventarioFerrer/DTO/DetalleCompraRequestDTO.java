package com.ferrer.inventarioFerrer.DTO;

import java.math.BigDecimal;

public class DetalleCompraRequestDTO {

	private Long productoId;
	private Integer cantidad;
	private BigDecimal costoUnitario;

	public DetalleCompraRequestDTO() {
	}

	public Long getProductoId() {
		return productoId;
	}

	public void setProductoId(Long productoId) {
		this.productoId = productoId;
	}

	public Integer getCantidad() {
		return cantidad;
	}

	public void setCantidad(Integer cantidad) {
		this.cantidad = cantidad;
	}

	public BigDecimal getCostoUnitario() {
		return costoUnitario;
	}

	public void setCostoUnitario(BigDecimal costoUnitario) {
		this.costoUnitario = costoUnitario;
	}
}