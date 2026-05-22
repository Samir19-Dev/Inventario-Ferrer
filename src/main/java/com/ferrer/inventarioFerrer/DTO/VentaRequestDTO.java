package com.ferrer.inventarioFerrer.DTO;

import java.util.List;

public class VentaRequestDTO {

	private Long clienteId;
	private List<DetalleVentaRequestDTO> detalles;

	public VentaRequestDTO() {
	}

	public Long getClienteId() {
		return clienteId;
	}

	public void setClienteId(Long clienteId) {
		this.clienteId = clienteId;
	}

	public List<DetalleVentaRequestDTO> getDetalles() {
		return detalles;
	}

	public void setDetalles(List<DetalleVentaRequestDTO> detalles) {
		this.detalles = detalles;
	}
}