package com.ferrer.inventarioFerrer.DTO;

public class CategoriaRequestDTO {

	private String nombre;
	private String descripcion;

	public CategoriaRequestDTO() {
	}

	public String getNombre() {
		return nombre;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}
}