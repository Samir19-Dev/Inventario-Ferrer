package com.ferrer.inventarioFerrer.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ferrer.inventarioFerrer.entity.Compra;

public interface CompraRepository extends JpaRepository<Compra, Long> {
}