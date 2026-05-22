package com.ferrer.inventarioFerrer.DTO;

public class ClienteResponseDTO {

	private Long id;
	private String nombre;
	private String telefono;
	private String email;
	private String direccion;

	public ClienteResponseDTO() {
	}

	public ClienteResponseDTO(Long id, String nombre, String telefono, String email, String direccion) {
		this.id = id;
		this.nombre = nombre;
		this.telefono = telefono;
		this.email = email;
		this.direccion = direccion;
	}

	public Long getId() {
		return id;
	}

	public String getNombre() {
		return nombre;
	}

	public String getTelefono() {
		return telefono;
	}

	public String getEmail() {
		return email;
	}

	public String getDireccion() {
		return direccion;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public void setTelefono(String telefono) {
		this.telefono = telefono;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public void setDireccion(String direccion) {
		this.direccion = direccion;
	}
}