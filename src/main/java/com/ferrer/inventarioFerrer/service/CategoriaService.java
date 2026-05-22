package com.ferrer.inventarioFerrer.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ferrer.inventarioFerrer.DTO.CategoriaRequestDTO;
import com.ferrer.inventarioFerrer.DTO.CategoriaResponseDTO;
import com.ferrer.inventarioFerrer.entity.Categoria;
import com.ferrer.inventarioFerrer.repository.CategoriaRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
@Transactional
public class CategoriaService {

	private final CategoriaRepository repository;

	public CategoriaService(CategoriaRepository repository) {
		this.repository = repository;
	}

	@Transactional(readOnly = true)
	public List<CategoriaResponseDTO> listar() {
		return repository.findAll().stream().map(this::toResponseDTO).toList();
	}

	@Transactional(readOnly = true)
	public CategoriaResponseDTO obtenerPorId(Long id) {
		Categoria categoria = repository.findById(id)
				.orElseThrow(() -> new EntityNotFoundException("Categoría no encontrada con id: " + id));

		return toResponseDTO(categoria);
	}

	public CategoriaResponseDTO crear(CategoriaRequestDTO dto) {
		validar(dto);

		if (repository.existsByNombreIgnoreCase(dto.getNombre().trim())) {
			throw new RuntimeException("Ya existe una categoría con ese nombre");
		}

		Categoria categoria = new Categoria();
		categoria.setNombre(dto.getNombre().trim());
		categoria.setDescripcion(dto.getDescripcion() != null ? dto.getDescripcion().trim() : null);

		return toResponseDTO(repository.save(categoria));
	}

	public CategoriaResponseDTO actualizar(Long id, CategoriaRequestDTO dto) {
		validar(dto);

		Categoria categoria = repository.findById(id)
				.orElseThrow(() -> new EntityNotFoundException("Categoría no encontrada con id: " + id));

		repository.findByNombreIgnoreCase(dto.getNombre().trim()).ifPresent(existente -> {
			if (!existente.getId().equals(id)) {
				throw new RuntimeException("Ya existe una categoría con ese nombre");
			}
		});

		categoria.setNombre(dto.getNombre().trim());
		categoria.setDescripcion(dto.getDescripcion() != null ? dto.getDescripcion().trim() : null);

		return toResponseDTO(repository.save(categoria));
	}

	public void eliminar(Long id) {
		if (!repository.existsById(id)) {
			throw new EntityNotFoundException("Categoría no encontrada con id: " + id);
		}

		repository.deleteById(id);
	}

	private void validar(CategoriaRequestDTO dto) {
		if (dto.getNombre() == null || dto.getNombre().trim().isEmpty()) {
			throw new IllegalArgumentException("El nombre es obligatorio");
		}

		if (dto.getNombre().trim().length() > 100) {
			throw new IllegalArgumentException("El nombre no puede superar 100 caracteres");
		}
	}

	private CategoriaResponseDTO toResponseDTO(Categoria categoria) {
		return new CategoriaResponseDTO(categoria.getId(), categoria.getNombre(), categoria.getDescripcion());
	}
}
