package com.ferrer.inventarioFerrer.entity;

import java.math.BigDecimal;

import jakarta.persistence.*;

@Entity
@Table(name = "detalle_compra")
public class DetalleCompra {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "compra_id", nullable = false)
	private Compra compra;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "producto_id", nullable = false)
	private Producto producto;

	@Column(nullable = false)
	private Integer cantidad;

	@Column(name = "costo_unitario", nullable = false, precision = 10, scale = 2)
	private BigDecimal costoUnitario;

	@Column(nullable = false, precision = 12, scale = 2)
	private BigDecimal subtotal;

	public DetalleCompra() {
	}

	public Long getId() {
		return id;
	}

	public Compra getCompra() {
		return compra;
	}

	public Producto getProducto() {
		return producto;
	}

	public Integer getCantidad() {
		return cantidad;
	}

	public BigDecimal getCostoUnitario() {
		return costoUnitario;
	}

	public BigDecimal getSubtotal() {
		return subtotal;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public void setCompra(Compra compra) {
		this.compra = compra;
	}

	public void setProducto(Producto producto) {
		this.producto = producto;
	}

	public void setCantidad(Integer cantidad) {
		this.cantidad = cantidad;
	}

	public void setCostoUnitario(BigDecimal costoUnitario) {
		this.costoUnitario = costoUnitario;
	}

	public void setSubtotal(BigDecimal subtotal) {
		this.subtotal = subtotal;
	}
}
