package com.ferrer.inventarioFerrer.DTO;

import java.util.List;

public class CompraRequestDTO {

	private Long proveedorId;
	private List<DetalleCompraRequestDTO> detalles;

	public CompraRequestDTO() {
	}

	public Long getProveedorId() {
		return proveedorId;
	}

	public void setProveedorId(Long proveedorId) {
		this.proveedorId = proveedorId;
	}

	public List<DetalleCompraRequestDTO> getDetalles() {
		return detalles;
	}

	public void setDetalles(List<DetalleCompraRequestDTO> detalles) {
		this.detalles = detalles;
	}
}