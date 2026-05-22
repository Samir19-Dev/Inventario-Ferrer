package com.ferrer.inventarioFerrer.DTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class CompraResponseDTO {

	private Long id;
	private LocalDateTime fecha;
	private Long proveedorId;
	private String proveedorNombre;
	private BigDecimal total;
	private List<DetalleCompraResponseDTO> detalles;

	public CompraResponseDTO() {
	}

	public CompraResponseDTO(Long id, LocalDateTime fecha, Long proveedorId, String proveedorNombre, BigDecimal total,
			List<DetalleCompraResponseDTO> detalles) {
		this.id = id;
		this.fecha = fecha;
		this.proveedorId = proveedorId;
		this.proveedorNombre = proveedorNombre;
		this.total = total;
		this.detalles = detalles;
	}

	public Long getId() {
		return id;
	}

	public LocalDateTime getFecha() {
		return fecha;
	}

	public Long getProveedorId() {
		return proveedorId;
	}

	public String getProveedorNombre() {
		return proveedorNombre;
	}

	public BigDecimal getTotal() {
		return total;
	}

	public List<DetalleCompraResponseDTO> getDetalles() {
		return detalles;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public void setFecha(LocalDateTime fecha) {
		this.fecha = fecha;
	}

	public void setProveedorId(Long proveedorId) {
		this.proveedorId = proveedorId;
	}

	public void setProveedorNombre(String proveedorNombre) {
		this.proveedorNombre = proveedorNombre;
	}

	public void setTotal(BigDecimal total) {
		this.total = total;
	}

	public void setDetalles(List<DetalleCompraResponseDTO> detalles) {
		this.detalles = detalles;
	}
}