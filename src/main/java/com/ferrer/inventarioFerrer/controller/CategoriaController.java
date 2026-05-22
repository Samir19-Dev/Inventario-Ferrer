package com.ferrer.inventarioFerrer.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ferrer.inventarioFerrer.DTO.CategoriaRequestDTO;
import com.ferrer.inventarioFerrer.DTO.CategoriaResponseDTO;
import com.ferrer.inventarioFerrer.service.CategoriaService;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {

	private final CategoriaService service;

	public CategoriaController(CategoriaService service) {
		this.service = service;
	}

	@GetMapping
	public ResponseEntity<List<CategoriaResponseDTO>> listar() {
		return ResponseEntity.ok(service.listar());
	}

	@GetMapping("/{id}")
	public ResponseEntity<CategoriaResponseDTO> obtenerPorId(@PathVariable Long id) {
		return ResponseEntity.ok(service.obtenerPorId(id));
	}

	@PostMapping
	public ResponseEntity<CategoriaResponseDTO> crear(@RequestBody CategoriaRequestDTO dto) {
		return ResponseEntity.status(HttpStatus.CREATED).body(service.crear(dto));
	}

	@PutMapping("/{id}")
	public ResponseEntity<CategoriaResponseDTO> actualizar(@PathVariable Long id,
			@RequestBody CategoriaRequestDTO dto) {
		return ResponseEntity.ok(service.actualizar(id, dto));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<String> eliminar(@PathVariable Long id) {
		service.eliminar(id);
		return ResponseEntity.ok("Categoría eliminada correctamente");
	}
}
