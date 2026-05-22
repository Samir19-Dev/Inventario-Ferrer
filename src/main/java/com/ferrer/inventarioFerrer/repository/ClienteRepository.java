package com.ferrer.inventarioFerrer.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ferrer.inventarioFerrer.entity.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
	List<Cliente> findByNombreContainingIgnoreCase(String nombre);
}