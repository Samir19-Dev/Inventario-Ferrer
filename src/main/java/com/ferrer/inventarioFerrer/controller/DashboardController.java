package com.ferrer.inventarioFerrer.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ferrer.inventarioFerrer.DTO.DashboardResumenDTO;
import com.ferrer.inventarioFerrer.DTO.ProductoResponseDTO;
import com.ferrer.inventarioFerrer.service.DashboardService;
import com.ferrer.inventarioFerrer.service.ProductoService;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

	private final DashboardService dashboardService;
	private final ProductoService productoService;

	public DashboardController(DashboardService dashboardService, ProductoService productoService) {
		this.dashboardService = dashboardService;
		this.productoService = productoService;
	}

	@GetMapping("/resumen")
	public ResponseEntity<DashboardResumenDTO> resumen() {
		return ResponseEntity.ok(dashboardService.obtenerResumen());
	}

	@GetMapping("/stock-bajo")
	public ResponseEntity<List<ProductoResponseDTO>> stockBajo() {
		return ResponseEntity.ok(productoService.listarStockBajo());
	}
}