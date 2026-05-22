package com.ferrer.inventarioFerrer.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ferrer.inventarioFerrer.entity.Venta;

public interface VentaRepository extends JpaRepository<Venta, Long> {
}