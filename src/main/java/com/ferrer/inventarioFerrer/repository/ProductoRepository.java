package com.ferrer.inventarioFerrer.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ferrer.inventarioFerrer.entity.Producto;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
	Optional<Producto> findByCodigoBarras(String codigoBarras);

	boolean existsByCodigoBarras(String codigoBarras);

	List<Producto> findByNombreContainingIgnoreCase(String nombre);
}