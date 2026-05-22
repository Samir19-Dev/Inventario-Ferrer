package com.ferrer.inventarioFerrer.DTO;

public class DashboardResumenDTO {

	private Long totalCategorias;
	private Long totalProductos;
	private Long productosStockBajo;
	private Long totalUsuarios;

	public DashboardResumenDTO() {
	}

	public DashboardResumenDTO(Long totalCategorias, Long totalProductos, Long productosStockBajo, Long totalUsuarios) {
		this.totalCategorias = totalCategorias;
		this.totalProductos = totalProductos;
		this.productosStockBajo = productosStockBajo;
		this.totalUsuarios = totalUsuarios;
	}

	public Long getTotalCategorias() {
		return totalCategorias;
	}

	public void setTotalCategorias(Long totalCategorias) {
		this.totalCategorias = totalCategorias;
	}

	public Long getTotalProductos() {
		return totalProductos;
	}

	public void setTotalProductos(Long totalProductos) {
		this.totalProductos = totalProductos;
	}

	public Long getProductosStockBajo() {
		return productosStockBajo;
	}

	public void setProductosStockBajo(Long productosStockBajo) {
		this.productosStockBajo = productosStockBajo;
	}

	public Long getTotalUsuarios() {
		return totalUsuarios;
	}

	public void setTotalUsuarios(Long totalUsuarios) {
		this.totalUsuarios = totalUsuarios;
	}
}