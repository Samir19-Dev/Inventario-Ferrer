package com.ferrer.inventarioFerrer.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ferrer.inventarioFerrer.DTO.ProveedorRequestDTO;
import com.ferrer.inventarioFerrer.DTO.ProveedorResponseDTO;
import com.ferrer.inventarioFerrer.entity.Proveedor;
import com.ferrer.inventarioFerrer.repository.ProveedorRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
@Transactional
public class ProveedorService {

	private final ProveedorRepository repository;

	public ProveedorService(ProveedorRepository repository) {
		this.repository = repository;
	}

	@Transactional(readOnly = true)
	public List<ProveedorResponseDTO> listar() {
		return repository.findAll().stream().map(this::toResponseDTO).toList();
	}

	@Transactional(readOnly = true)
	public ProveedorResponseDTO obtenerPorId(Long id) {
		Proveedor proveedor = repository.findById(id)
				.orElseThrow(() -> new EntityNotFoundException("Proveedor no encontrado con id: " + id));

		return toResponseDTO(proveedor);
	}

	@Transactional(readOnly = true)
	public List<ProveedorResponseDTO> buscarPorNombre(String nombre) {
		return repository.findByNombreContainingIgnoreCase(nombre).stream().map(this::toResponseDTO).toList();
	}

	public ProveedorResponseDTO crear(ProveedorRequestDTO dto) {
		validar(dto);

		Proveedor proveedor = new Proveedor();
		proveedor.setNombre(dto.getNombre().trim());
		proveedor.setTelefono(limpiar(dto.getTelefono()));
		proveedor.setEmail(limpiar(dto.getEmail()));
		proveedor.setDireccion(limpiar(dto.getDireccion()));

		return toResponseDTO(repository.save(proveedor));
	}

	public ProveedorResponseDTO actualizar(Long id, ProveedorRequestDTO dto) {
		validar(dto);

		Proveedor proveedor = repository.findById(id)
				.orElseThrow(() -> new EntityNotFoundException("Proveedor no encontrado con id: " + id));

		proveedor.setNombre(dto.getNombre().trim());
		proveedor.setTelefono(limpiar(dto.getTelefono()));
		proveedor.setEmail(limpiar(dto.getEmail()));
		proveedor.setDireccion(limpiar(dto.getDireccion()));

		return toResponseDTO(repository.save(proveedor));
	}

	public void eliminar(Long id) {
		if (!repository.existsById(id)) {
			throw new EntityNotFoundException("Proveedor no encontrado con id: " + id);
		}

		repository.deleteById(id);
	}

	private void validar(ProveedorRequestDTO dto) {
		if (dto.getNombre() == null || dto.getNombre().trim().isEmpty()) {
			throw new IllegalArgumentException("El nombre es obligatorio");
		}

		if (dto.getNombre().trim().length() > 150) {
			throw new IllegalArgumentException("El nombre no puede superar 150 caracteres");
		}

		if (dto.getTelefono() != null && dto.getTelefono().trim().length() > 30) {
			throw new IllegalArgumentException("El teléfono no puede superar 30 caracteres");
		}

		if (dto.getEmail() != null && dto.getEmail().trim().length() > 120) {
			throw new IllegalArgumentException("El email no puede superar 120 caracteres");
		}

		if (dto.getDireccion() != null && dto.getDireccion().trim().length() > 200) {
			throw new IllegalArgumentException("La dirección no puede superar 200 caracteres");
		}
	}

	private String limpiar(String valor) {
		if (valor == null || valor.trim().isEmpty()) {
			return null;
		}
		return valor.trim();
	}

	private ProveedorResponseDTO toResponseDTO(Proveedor proveedor) {
		return new ProveedorResponseDTO(proveedor.getId(), proveedor.getNombre(), proveedor.getTelefono(),
				proveedor.getEmail(), proveedor.getDireccion());
	}
}