package com.ferrer.inventarioFerrer.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ferrer.inventarioFerrer.entity.DetalleVenta;

public interface DetalleVentaRepository extends JpaRepository<DetalleVenta, Long> {
	List<DetalleVenta> findByVentaId(Long ventaId);
}