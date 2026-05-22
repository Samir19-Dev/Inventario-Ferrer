package com.ferrer.inventarioFerrer.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "movimientos_inventario")
public class MovimientoInventario {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "producto_id", nullable = false)
	private Producto producto;

	@Column(nullable = false, length = 20)
	private String tipo;

	@Column(nullable = false)
	private Integer cantidad;

	@Column(nullable = false)
	private LocalDateTime fecha;

	@Column(length = 100)
	private String referencia;

	@Column(length = 255)
	private String observacion;

	public MovimientoInventario() {
	}

	public Long getId() {
		return id;
	}

	public Producto getProducto() {
		return producto;
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

	public void setProducto(Producto producto) {
		this.producto = producto;
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