package com.ferrer.inventarioFerrer.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ferrer.inventarioFerrer.DTO.CompraRequestDTO;
import com.ferrer.inventarioFerrer.DTO.CompraResponseDTO;
import com.ferrer.inventarioFerrer.DTO.DetalleCompraRequestDTO;
import com.ferrer.inventarioFerrer.DTO.DetalleCompraResponseDTO;
import com.ferrer.inventarioFerrer.entity.Compra;
import com.ferrer.inventarioFerrer.entity.DetalleCompra;
import com.ferrer.inventarioFerrer.entity.Producto;
import com.ferrer.inventarioFerrer.entity.Proveedor;
import com.ferrer.inventarioFerrer.repository.CompraRepository;
import com.ferrer.inventarioFerrer.repository.DetalleCompraRepository;
import com.ferrer.inventarioFerrer.repository.ProductoRepository;
import com.ferrer.inventarioFerrer.repository.ProveedorRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
@Transactional
public class CompraService {

    private final CompraRepository compraRepository;
    private final DetalleCompraRepository detalleCompraRepository;
    private final ProductoRepository productoRepository;
    private final ProveedorRepository proveedorRepository;
    private final MovimientoInventarioService movimientoInventarioService;

    public CompraService(
            CompraRepository compraRepository,
            DetalleCompraRepository detalleCompraRepository,
            ProductoRepository productoRepository,
            ProveedorRepository proveedorRepository,
            MovimientoInventarioService movimientoInventarioService) {
        this.compraRepository = compraRepository;
        this.detalleCompraRepository = detalleCompraRepository;
        this.productoRepository = productoRepository;
        this.proveedorRepository = proveedorRepository;
        this.movimientoInventarioService = movimientoInventarioService;
    }

    @Transactional(readOnly = true)
    public List<CompraResponseDTO> listar() {
        return compraRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public CompraResponseDTO obtenerPorId(Long id) {
        Compra compra = compraRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Compra no encontrada con id: " + id));

        return toResponseDTO(compra);
    }

    public CompraResponseDTO crear(CompraRequestDTO dto) {
        validar(dto);

        Proveedor proveedor = proveedorRepository.findById(dto.getProveedorId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Proveedor no encontrado con id: " + dto.getProveedorId()));

        Compra compra = new Compra();
        compra.setFecha(LocalDateTime.now());
        compra.setProveedor(proveedor);
        compra.setTotal(BigDecimal.ZERO);

        Compra compraGuardada = compraRepository.save(compra);

        BigDecimal total = BigDecimal.ZERO;

        for (DetalleCompraRequestDTO detalleDTO : dto.getDetalles()) {
            Producto producto = productoRepository.findById(detalleDTO.getProductoId())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Producto no encontrado con id: " + detalleDTO.getProductoId()));

            BigDecimal subtotal = detalleDTO.getCostoUnitario()
                    .multiply(BigDecimal.valueOf(detalleDTO.getCantidad()));

            DetalleCompra detalle = new DetalleCompra();
            detalle.setCompra(compraGuardada);
            detalle.setProducto(producto);
            detalle.setCantidad(detalleDTO.getCantidad());
            detalle.setCostoUnitario(detalleDTO.getCostoUnitario());
            detalle.setSubtotal(subtotal);

            detalleCompraRepository.save(detalle);

            Integer stockActual = producto.getStock() != null ? producto.getStock() : 0;
            producto.setStock(stockActual + detalleDTO.getCantidad());
            producto.setPrecioCompra(detalleDTO.getCostoUnitario());
            productoRepository.save(producto);

            movimientoInventarioService.registrarMovimiento(
                    producto,
                    "ENTRADA",
                    detalleDTO.getCantidad(),
                    "Compra #" + compraGuardada.getId(),
                    "Ingreso por compra al proveedor " + proveedor.getNombre()
            );

            total = total.add(subtotal);
        }

        compraGuardada.setTotal(total);
        compraRepository.save(compraGuardada);

        return toResponseDTO(compraGuardada);
    }

    private void validar(CompraRequestDTO dto) {
        if (dto.getProveedorId() == null) {
            throw new IllegalArgumentException("El proveedor es obligatorio");
        }

        if (dto.getDetalles() == null || dto.getDetalles().isEmpty()) {
            throw new IllegalArgumentException("La compra debe tener al menos un detalle");
        }

        Set<Long> productos = new HashSet<>();

        for (DetalleCompraRequestDTO detalle : dto.getDetalles()) {
            if (detalle.getProductoId() == null) {
                throw new IllegalArgumentException("El producto es obligatorio en cada detalle");
            }

            if (!productos.add(detalle.getProductoId())) {
                throw new IllegalArgumentException("No se puede repetir el mismo producto en la compra");
            }

            if (detalle.getCantidad() == null || detalle.getCantidad() <= 0) {
                throw new IllegalArgumentException("La cantidad debe ser mayor a 0");
            }

            if (detalle.getCostoUnitario() == null
                    || detalle.getCostoUnitario().compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalArgumentException("El costo unitario debe ser mayor a 0");
            }
        }
    }

    private CompraResponseDTO toResponseDTO(Compra compra) {
        List<DetalleCompraResponseDTO> detalles = detalleCompraRepository.findByCompraId(compra.getId())
                .stream()
                .map(detalle -> new DetalleCompraResponseDTO(
                        detalle.getId(),
                        detalle.getProducto().getId(),
                        detalle.getProducto().getNombre(),
                        detalle.getCantidad(),
                        detalle.getCostoUnitario(),
                        detalle.getSubtotal()))
                .toList();

        return new CompraResponseDTO(
                compra.getId(),
                compra.getFecha(),
                compra.getProveedor().getId(),
                compra.getProveedor().getNombre(),
                compra.getTotal(),
                detalles);
    }
}