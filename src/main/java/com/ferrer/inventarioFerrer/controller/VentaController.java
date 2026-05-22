package com.ferrer.inventarioFerrer.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ferrer.inventarioFerrer.DTO.VentaRequestDTO;
import com.ferrer.inventarioFerrer.DTO.VentaResponseDTO;
import com.ferrer.inventarioFerrer.service.VentaService;

@RestController
@RequestMapping("/api/ventas")
public class VentaController {

	private final VentaService service;

	public VentaController(VentaService service) {
		this.service = service;
	}

	@GetMapping
	public ResponseEntity<List<VentaResponseDTO>> listar() {
		return ResponseEntity.ok(service.listar());
	}

	@GetMapping("/{id}")
	public ResponseEntity<VentaResponseDTO> obtenerPorId(@PathVariable Long id) {
		return ResponseEntity.ok(service.obtenerPorId(id));
	}

	@PostMapping
	public ResponseEntity<VentaResponseDTO> crear(@RequestBody VentaRequestDTO dto) {
		return ResponseEntity.status(HttpStatus.CREATED).body(service.crear(dto));
	}
}