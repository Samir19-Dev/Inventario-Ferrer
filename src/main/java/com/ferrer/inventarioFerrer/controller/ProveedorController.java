package com.ferrer.inventarioFerrer.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ferrer.inventarioFerrer.DTO.ProveedorRequestDTO;
import com.ferrer.inventarioFerrer.DTO.ProveedorResponseDTO;
import com.ferrer.inventarioFerrer.service.ProveedorService;

@RestController
@RequestMapping("/api/proveedores")
public class ProveedorController {

	private final ProveedorService service;

	public ProveedorController(ProveedorService service) {
		this.service = service;
	}

	@GetMapping
	public ResponseEntity<List<ProveedorResponseDTO>> listar() {
		return ResponseEntity.ok(service.listar());
	}

	@GetMapping("/{id}")
	public ResponseEntity<ProveedorResponseDTO> obtenerPorId(@PathVariable Long id) {
		return ResponseEntity.ok(service.obtenerPorId(id));
	}

	@GetMapping("/buscar")
	public ResponseEntity<List<ProveedorResponseDTO>> buscarPorNombre(@RequestParam String nombre) {
		return ResponseEntity.ok(service.buscarPorNombre(nombre));
	}

	@PostMapping
	public ResponseEntity<ProveedorResponseDTO> crear(@RequestBody ProveedorRequestDTO dto) {
		return ResponseEntity.status(HttpStatus.CREATED).body(service.crear(dto));
	}

	@PutMapping("/{id}")
	public ResponseEntity<ProveedorResponseDTO> actualizar(@PathVariable Long id,
			@RequestBody ProveedorRequestDTO dto) {
		return ResponseEntity.ok(service.actualizar(id, dto));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<String> eliminar(@PathVariable Long id) {
		service.eliminar(id);
		return ResponseEntity.ok("Proveedor eliminado correctamente");
	}
}