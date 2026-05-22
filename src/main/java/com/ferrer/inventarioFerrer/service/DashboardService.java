package com.ferrer.inventarioFerrer.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ferrer.inventarioFerrer.DTO.DashboardResumenDTO;
import com.ferrer.inventarioFerrer.repository.CategoriaRepository;
import com.ferrer.inventarioFerrer.repository.ProductoRepository;
import com.ferrer.inventarioFerrer.repository.UsuarioRepository;

@Service
@Transactional(readOnly = true)
public class DashboardService {

	private final CategoriaRepository categoriaRepository;
	private final ProductoRepository productoRepository;
	private final UsuarioRepository usuarioRepository;

	public DashboardService(CategoriaRepository categoriaRepository, ProductoRepository productoRepository,
			UsuarioRepository usuarioRepository) {
		this.categoriaRepository = categoriaRepository;
		this.productoRepository = productoRepository;
		this.usuarioRepository = usuarioRepository;
	}

	public DashboardResumenDTO obtenerResumen() {
		long totalCategorias = categoriaRepository.count();
		long totalProductos = productoRepository.count();
		long totalUsuarios = usuarioRepository.count();

		long productosStockBajo = productoRepository.findAll().stream()
				.filter(p -> p.getStock() != null && p.getStockMinimo() != null && p.getStock() <= p.getStockMinimo())
				.count();

		return new DashboardResumenDTO(totalCategorias, totalProductos, productosStockBajo, totalUsuarios);
	}
}