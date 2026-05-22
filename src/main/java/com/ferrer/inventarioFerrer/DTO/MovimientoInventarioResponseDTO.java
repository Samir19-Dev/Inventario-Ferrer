package com.ferrer.inventarioFerrer.DTO;

import java.time.LocalDateTime;

public class MovimientoInventarioResponseDTO {

	private Long id;
	private Long productoId;
	private String productoNombre;
	private String tipo;
	private Integer cantidad;
	private LocalDateTime fecha;
	private String referencia;
	private String observacion;

	public MovimientoInventarioResponseDTO() {
	}

	public MovimientoInventarioResponseDTO(Long id, Long productoId, String productoNombre, String tipo,
			Integer cantidad, LocalDateTime fecha, String referencia, String observacion) {
		this.id = id;
		this.productoId = productoId;
		this.productoNombre = productoNombre;
		this.tipo = tipo;
		this.cantidad = cantidad;
		this.fecha = fecha;
		this.referencia = referencia;
		this.observacion = observacion;
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

	public String getTipo() {
		return tipo;
	}

	public Integer getCantidad() {
		return cantidad;
	}

	public LocalDateTime getFecha() {
		return fecha;
	}

	public String getReferencia() {
		return referencia;
	}

	public String getObservacion() {
		return observacion;
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

	public void setTipo(String tipo) {
		this.tipo = tipo;
	}

	public void setCantidad(Integer cantidad) {
		this.cantidad = cantidad;
	}

	public void setFecha(LocalDateTime fecha) {
		this.fecha = fecha;
	}

	public void setReferencia(String referencia) {
		this.referencia = referencia;
	}

	public void setObservacion(String observacion) {
		this.observacion = observacion;
	}
}