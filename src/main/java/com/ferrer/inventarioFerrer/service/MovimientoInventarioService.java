package com.ferrer.inventarioFerrer.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ferrer.inventarioFerrer.DTO.MovimientoInventarioResponseDTO;
import com.ferrer.inventarioFerrer.entity.MovimientoInventario;
import com.ferrer.inventarioFerrer.entity.Producto;
import com.ferrer.inventarioFerrer.repository.MovimientoInventarioRepository;
import com.ferrer.inventarioFerrer.repository.ProductoRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
@Transactional
public class MovimientoInventarioService {

    private final MovimientoInventarioRepository repository;
    private final ProductoRepository productoRepository;

    public MovimientoInventarioService(
            MovimientoInventarioRepository repository,
            ProductoRepository productoRepository) {
        this.repository = repository;
        this.productoRepository = productoRepository;
    }

    @Transactional(readOnly = true)
    public List<MovimientoInventarioResponseDTO> listar() {
        return repository.findAllByOrderByFechaDesc()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MovimientoInventarioResponseDTO> listarPorProducto(Long productoId) {
        if (!productoRepository.existsById(productoId)) {
            throw new EntityNotFoundException("Producto no encontrado con id: " + productoId);
        }

        return repository.findByProductoIdOrderByFechaDesc(productoId)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public void registrarMovimiento(
            Producto producto,
            String tipo,
            Integer cantidad,
            String referencia,
            String observacion) {

        MovimientoInventario movimiento = new MovimientoInventario();
        movimiento.setProducto(producto);
        movimiento.setTipo(tipo);
        movimiento.setCantidad(cantidad);
        movimiento.setFecha(LocalDateTime.now());
        movimiento.setReferencia(referencia);
        movimiento.setObservacion(observacion);

        repository.save(movimiento);
    }

    private MovimientoInventarioResponseDTO toResponseDTO(MovimientoInventario movimiento) {
        return new MovimientoInventarioResponseDTO(
                movimiento.getId(),
                movimiento.getProducto().getId(),
                movimiento.getProducto().getNombre(),
                movimiento.getTipo(),
                movimiento.getCantidad(),
                movimiento.getFecha(),
                movimiento.getReferencia(),
                movimiento.getObservacion());
    }
}