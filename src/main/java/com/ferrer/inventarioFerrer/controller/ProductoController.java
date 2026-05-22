package com.ferrer.inventarioFerrer.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ferrer.inventarioFerrer.DTO.ProductoRequestDTO;
import com.ferrer.inventarioFerrer.DTO.ProductoResponseDTO;
import com.ferrer.inventarioFerrer.service.ProductoService;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

	private final ProductoService service;

	public ProductoController(ProductoService service) {
		this.service = service;
	}

	@GetMapping
	public ResponseEntity<List<ProductoResponseDTO>> listar() {
		return ResponseEntity.ok(service.listar());
	}

	@GetMapping("/{id}")
	public ResponseEntity<ProductoResponseDTO> obtenerPorId(@PathVariable Long id) {
		return ResponseEntity.ok(service.obtenerPorId(id));
	}

	@GetMapping("/buscar")
	public ResponseEntity<List<ProductoResponseDTO>> buscarPorNombre(@RequestParam String nombre) {
		return ResponseEntity.ok(service.buscarPorNombre(nombre));
	}

	@GetMapping("/stock-bajo")
	public ResponseEntity<List<ProductoResponseDTO>> listarStockBajo() {
		return ResponseEntity.ok(service.listarStockBajo());
	}

	@PostMapping
	public ResponseEntity<ProductoResponseDTO> crear(@RequestBody ProductoRequestDTO dto) {
		return ResponseEntity.status(HttpStatus.CREATED).body(service.crear(dto));
	}

	@PutMapping("/{id}")
	public ResponseEntity<ProductoResponseDTO> actualizar(@PathVariable Long id, @RequestBody ProductoRequestDTO dto) {
		return ResponseEntity.ok(service.actualizar(id, dto));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<String> eliminar(@PathVariable Long id) {
		service.eliminar(id);
		return ResponseEntity.ok("Producto eliminado correctamente");
	}
}
