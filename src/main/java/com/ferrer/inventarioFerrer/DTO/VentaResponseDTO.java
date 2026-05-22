package com.ferrer.inventarioFerrer.DTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class VentaResponseDTO {

	private Long id;
	private LocalDateTime fecha;
	private Long clienteId;
	private String clienteNombre;
	private BigDecimal total;
	private List<DetalleVentaResponseDTO> detalles;

	public VentaResponseDTO() {
	}

	public VentaResponseDTO(Long id, LocalDateTime fecha, Long clienteId, String clienteNombre, BigDecimal total,
			List<DetalleVentaResponseDTO> detalles) {
		this.id = id;
		this.fecha = fecha;
		this.clienteId = clienteId;
		this.clienteNombre = clienteNombre;
		this.total = total;
		this.detalles = detalles;
	}

	public Long getId() {
		return id;
	}

	public LocalDateTime getFecha() {
		return fecha;
	}

	public Long getClienteId() {
		return clienteId;
	}

	public String getClienteNombre() {
		return clienteNombre;
	}

	public BigDecimal getTotal() {
		return total;
	}

	public List<DetalleVentaResponseDTO> getDetalles() {
		return detalles;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public void setFecha(LocalDateTime fecha) {
		this.fecha = fecha;
	}

	public void setClienteId(Long clienteId) {
		this.clienteId = clienteId;
	}

	public void setClienteNombre(String clienteNombre) {
		this.clienteNombre = clienteNombre;
	}

	public void setTotal(BigDecimal total) {
		this.total = total;
	}

	public void setDetalles(List<DetalleVentaResponseDTO> detalles) {
		this.detalles = detalles;
	}
}