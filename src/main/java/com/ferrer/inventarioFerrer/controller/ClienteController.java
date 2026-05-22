package com.ferrer.inventarioFerrer.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ferrer.inventarioFerrer.DTO.ClienteRequestDTO;
import com.ferrer.inventarioFerrer.DTO.ClienteResponseDTO;
import com.ferrer.inventarioFerrer.service.ClienteService;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

	private final ClienteService service;

	public ClienteController(ClienteService service) {
		this.service = service;
	}

	@GetMapping
	public ResponseEntity<List<ClienteResponseDTO>> listar() {
		return ResponseEntity.ok(service.listar());
	}

	@GetMapping("/{id}")
	public ResponseEntity<ClienteResponseDTO> obtenerPorId(@PathVariable Long id) {
		return ResponseEntity.ok(service.obtenerPorId(id));
	}

	@GetMapping("/buscar")
	public ResponseEntity<List<ClienteResponseDTO>> buscarPorNombre(@RequestParam String nombre) {
		return ResponseEntity.ok(service.buscarPorNombre(nombre));
	}

	@PostMapping
	public ResponseEntity<ClienteResponseDTO> crear(@RequestBody ClienteRequestDTO dto) {
		return ResponseEntity.status(HttpStatus.CREATED).body(service.crear(dto));
	}

	@PutMapping("/{id}")
	public ResponseEntity<ClienteResponseDTO> actualizar(@PathVariable Long id, @RequestBody ClienteRequestDTO dto) {
		return ResponseEntity.ok(service.actualizar(id, dto));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<String> eliminar(@PathVariable Long id) {
		service.eliminar(id);
		return ResponseEntity.ok("Cliente eliminado correctamente");
	}
}