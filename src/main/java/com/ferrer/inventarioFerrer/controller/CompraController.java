package com.ferrer.inventarioFerrer.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ferrer.inventarioFerrer.DTO.CompraRequestDTO;
import com.ferrer.inventarioFerrer.DTO.CompraResponseDTO;
import com.ferrer.inventarioFerrer.service.CompraService;

@RestController
@RequestMapping("/api/compras")
public class CompraController {

	private final CompraService service;

	public CompraController(CompraService service) {
		this.service = service;
	}

	@GetMapping
	public ResponseEntity<List<CompraResponseDTO>> listar() {
		return ResponseEntity.ok(service.listar());
	}

	@GetMapping("/{id}")
	public ResponseEntity<CompraResponseDTO> obtenerPorId(@PathVariable Long id) {
		return ResponseEntity.ok(service.obtenerPorId(id));
	}

	@PostMapping
	public ResponseEntity<CompraResponseDTO> crear(@RequestBody CompraRequestDTO dto) {
		return ResponseEntity.status(HttpStatus.CREATED).body(service.crear(dto));
	}
}