package com.ferrer.inventarioFerrer.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ferrer.inventarioFerrer.DTO.MovimientoInventarioResponseDTO;
import com.ferrer.inventarioFerrer.service.MovimientoInventarioService;

@RestController
@RequestMapping("/api/movimientos-inventario")
public class MovimientoInventarioController {

    private final MovimientoInventarioService service;

    public MovimientoInventarioController(MovimientoInventarioService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<MovimientoInventarioResponseDTO>> listar() {
        return ResponseEntity.ok(service.listar());
    }

    @GetMapping("/producto/{productoId}")
    public ResponseEntity<List<MovimientoInventarioResponseDTO>> listarPorProducto(@PathVariable Long productoId) {
        return ResponseEntity.ok(service.listarPorProducto(productoId));
    }
}