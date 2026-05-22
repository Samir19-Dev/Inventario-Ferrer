package com.ferrer.inventarioFerrer.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ferrer.inventarioFerrer.DTO.ClienteRequestDTO;
import com.ferrer.inventarioFerrer.DTO.ClienteResponseDTO;
import com.ferrer.inventarioFerrer.entity.Cliente;
import com.ferrer.inventarioFerrer.repository.ClienteRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
@Transactional
public class ClienteService {

	private final ClienteRepository repository;

	public ClienteService(ClienteRepository repository) {
		this.repository = repository;
	}

	@Transactional(readOnly = true)
	public List<ClienteResponseDTO> listar() {
		return repository.findAll().stream().map(this::toResponseDTO).toList();
	}

	@Transactional(readOnly = true)
	public ClienteResponseDTO obtenerPorId(Long id) {
		Cliente cliente = repository.findById(id)
				.orElseThrow(() -> new EntityNotFoundException("Cliente no encontrado con id: " + id));

		return toResponseDTO(cliente);
	}

	@Transactional(readOnly = true)
	public List<ClienteResponseDTO> buscarPorNombre(String nombre) {
		return repository.findByNombreContainingIgnoreCase(nombre).stream().map(this::toResponseDTO).toList();
	}

	public ClienteResponseDTO crear(ClienteRequestDTO dto) {
		validar(dto);

		Cliente cliente = new Cliente();
		cliente.setNombre(dto.getNombre().trim());
		cliente.setTelefono(limpiar(dto.getTelefono()));
		cliente.setEmail(limpiar(dto.getEmail()));
		cliente.setDireccion(limpiar(dto.getDireccion()));

		return toResponseDTO(repository.save(cliente));
	}

	public ClienteResponseDTO actualizar(Long id, ClienteRequestDTO dto) {
		validar(dto);

		Cliente cliente = repository.findById(id)
				.orElseThrow(() -> new EntityNotFoundException("Cliente no encontrado con id: " + id));

		cliente.setNombre(dto.getNombre().trim());
		cliente.setTelefono(limpiar(dto.getTelefono()));
		cliente.setEmail(limpiar(dto.getEmail()));
		cliente.setDireccion(limpiar(dto.getDireccion()));

		return toResponseDTO(repository.save(cliente));
	}

	public void eliminar(Long id) {
		if (!repository.existsById(id)) {
			throw new EntityNotFoundException("Cliente no encontrado con id: " + id);
		}

		repository.deleteById(id);
	}

	private void validar(ClienteRequestDTO dto) {
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

	private ClienteResponseDTO toResponseDTO(Cliente cliente) {
		return new ClienteResponseDTO(cliente.getId(), cliente.getNombre(), cliente.getTelefono(), cliente.getEmail(),
				cliente.getDireccion());
	}
}