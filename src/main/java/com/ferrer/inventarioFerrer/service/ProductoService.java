package com.ferrer.inventarioFerrer.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ferrer.inventarioFerrer.DTO.ProductoRequestDTO;
import com.ferrer.inventarioFerrer.DTO.ProductoResponseDTO;
import com.ferrer.inventarioFerrer.entity.Categoria;
import com.ferrer.inventarioFerrer.entity.Producto;
import com.ferrer.inventarioFerrer.repository.CategoriaRepository;
import com.ferrer.inventarioFerrer.repository.ProductoRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
@Transactional
public class ProductoService {

	private final ProductoRepository repository;
	private final CategoriaRepository categoriaRepository;

	public ProductoService(ProductoRepository repository, CategoriaRepository categoriaRepository) {
		this.repository = repository;
		this.categoriaRepository = categoriaRepository;
	}

	@Transactional(readOnly = true)
	public List<ProductoResponseDTO> listar() {
		return repository.findAll().stream().map(this::toResponseDTO).toList();
	}

	@Transactional(readOnly = true)
	public ProductoResponseDTO obtenerPorId(Long id) {
		Producto producto = repository.findById(id)
				.orElseThrow(() -> new EntityNotFoundException("Producto no encontrado con id: " + id));

		return toResponseDTO(producto);
	}

	@Transactional(readOnly = true)
	public List<ProductoResponseDTO> buscarPorNombre(String nombre) {
		return repository.findByNombreContainingIgnoreCase(nombre).stream().map(this::toResponseDTO).toList();
	}

	@Transactional(readOnly = true)
	public List<ProductoResponseDTO> listarStockBajo() {
		return repository.findAll().stream()
				.filter(p -> p.getStock() != null && p.getStockMinimo() != null && p.getStock() <= p.getStockMinimo())
				.map(this::toResponseDTO).toList();
	}

	public ProductoResponseDTO crear(ProductoRequestDTO dto) {
		validar(dto);

		if (dto.getCodigoBarras() != null && !dto.getCodigoBarras().trim().isEmpty()) {
			if (repository.existsByCodigoBarras(dto.getCodigoBarras().trim())) {
				throw new RuntimeException("Ya existe un producto con ese código de barras");
			}
		}

		Categoria categoria = obtenerCategoria(dto.getCategoriaId());

		Producto producto = new Producto();
		producto.setNombre(dto.getNombre().trim());
		producto.setDescripcion(dto.getDescripcion() != null ? dto.getDescripcion().trim() : null);
		producto.setCodigoBarras(dto.getCodigoBarras() != null ? dto.getCodigoBarras().trim() : null);
		producto.setPrecioCompra(dto.getPrecioCompra());
		producto.setPrecioVenta(dto.getPrecioVenta());
		producto.setStock(dto.getStock() != null ? dto.getStock() : 0);
		producto.setStockMinimo(dto.getStockMinimo() != null ? dto.getStockMinimo() : 5);
		producto.setCategoria(categoria);

		return toResponseDTO(repository.save(producto));
	}

	public ProductoResponseDTO actualizar(Long id, ProductoRequestDTO dto) {
		validar(dto);

		Producto producto = repository.findById(id)
				.orElseThrow(() -> new EntityNotFoundException("Producto no encontrado con id: " + id));

		if (dto.getCodigoBarras() != null && !dto.getCodigoBarras().trim().isEmpty()) {
			repository.findByCodigoBarras(dto.getCodigoBarras().trim()).ifPresent(existente -> {
				if (!existente.getId().equals(id)) {
					throw new RuntimeException("Ya existe un producto con ese código de barras");
				}
			});
		}

		Categoria categoria = obtenerCategoria(dto.getCategoriaId());

		producto.setNombre(dto.getNombre().trim());
		producto.setDescripcion(dto.getDescripcion() != null ? dto.getDescripcion().trim() : null);
		producto.setCodigoBarras(dto.getCodigoBarras() != null ? dto.getCodigoBarras().trim() : null);
		producto.setPrecioCompra(dto.getPrecioCompra());
		producto.setPrecioVenta(dto.getPrecioVenta());
		producto.setStock(dto.getStock() != null ? dto.getStock() : 0);
		producto.setStockMinimo(dto.getStockMinimo() != null ? dto.getStockMinimo() : 5);
		producto.setCategoria(categoria);

		return toResponseDTO(repository.save(producto));
	}

	public void eliminar(Long id) {
		if (!repository.existsById(id)) {
			throw new EntityNotFoundException("Producto no encontrado con id: " + id);
		}

		repository.deleteById(id);
	}

	private Categoria obtenerCategoria(Long categoriaId) {
		if (categoriaId == null) {
			throw new IllegalArgumentException("La categoría es obligatoria");
		}

		return categoriaRepository.findById(categoriaId)
				.orElseThrow(() -> new EntityNotFoundException("Categoría no encontrada con id: " + categoriaId));
	}

	private void validar(ProductoRequestDTO dto) {
		if (dto.getNombre() == null || dto.getNombre().trim().isEmpty()) {
			throw new IllegalArgumentException("El nombre es obligatorio");
		}

		if (dto.getPrecioCompra() == null || dto.getPrecioCompra().compareTo(BigDecimal.ZERO) < 0) {
			throw new IllegalArgumentException("El precio de compra debe ser mayor o igual a 0");
		}

		if (dto.getPrecioVenta() == null || dto.getPrecioVenta().compareTo(BigDecimal.ZERO) < 0) {
			throw new IllegalArgumentException("El precio de venta debe ser mayor o igual a 0");
		}

		if (dto.getStock() != null && dto.getStock() < 0) {
			throw new IllegalArgumentException("El stock no puede ser negativo");
		}

		if (dto.getStockMinimo() != null && dto.getStockMinimo() < 0) {
			throw new IllegalArgumentException("El stock mínimo no puede ser negativo");
		}
	}

	private ProductoResponseDTO toResponseDTO(Producto producto) {
		return new ProductoResponseDTO(producto.getId(), producto.getNombre(), producto.getDescripcion(),
				producto.getCodigoBarras(), producto.getPrecioCompra(), producto.getPrecioVenta(), producto.getStock(),
				producto.getStockMinimo(), producto.getCategoria() != null ? producto.getCategoria().getId() : null,
				producto.getCategoria() != null ? producto.getCategoria().getNombre() : null);
	}
}
