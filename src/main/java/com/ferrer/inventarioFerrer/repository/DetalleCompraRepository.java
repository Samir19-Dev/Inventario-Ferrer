package com.ferrer.inventarioFerrer.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ferrer.inventarioFerrer.entity.DetalleCompra;

public interface DetalleCompraRepository extends JpaRepository<DetalleCompra, Long> {
	List<DetalleCompra> findByCompraId(Long compraId);
}