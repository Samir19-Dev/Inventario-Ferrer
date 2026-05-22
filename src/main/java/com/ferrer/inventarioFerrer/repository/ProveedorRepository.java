package com.ferrer.inventarioFerrer.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ferrer.inventarioFerrer.entity.Proveedor;

public interface ProveedorRepository extends JpaRepository<Proveedor, Long> {
	List<Proveedor> findByNombreContainingIgnoreCase(String nombre);
}