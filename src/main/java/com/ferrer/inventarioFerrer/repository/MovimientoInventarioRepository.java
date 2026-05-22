package com.ferrer.inventarioFerrer.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ferrer.inventarioFerrer.entity.MovimientoInventario;

public interface MovimientoInventarioRepository extends JpaRepository<MovimientoInventario, Long> {

    List<MovimientoInventario> findByProductoIdOrderByFechaDesc(Long productoId);

    List<MovimientoInventario> findAllByOrderByFechaDesc();
}