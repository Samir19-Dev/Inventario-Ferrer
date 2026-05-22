package com.ferrer.inventarioFerrer.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ferrer.inventarioFerrer.DTO.DetalleVentaRequestDTO;
import com.ferrer.inventarioFerrer.DTO.DetalleVentaResponseDTO;
import com.ferrer.inventarioFerrer.DTO.VentaRequestDTO;
import com.ferrer.inventarioFerrer.DTO.VentaResponseDTO;
import com.ferrer.inventarioFerrer.entity.Cliente;
import com.ferrer.inventarioFerrer.entity.DetalleVenta;
import com.ferrer.inventarioFerrer.entity.Producto;
import com.ferrer.inventarioFerrer.entity.Venta;
import com.ferrer.inventarioFerrer.repository.ClienteRepository;
import com.ferrer.inventarioFerrer.repository.DetalleVentaRepository;
import com.ferrer.inventarioFerrer.repository.ProductoRepository;
import com.ferrer.inventarioFerrer.repository.VentaRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
@Transactional
public class VentaService {

    private final VentaRepository ventaRepository;
    private final DetalleVentaRepository detalleVentaRepository;
    private final ProductoRepository productoRepository;
    private final ClienteRepository clienteRepository;
    private final MovimientoInventarioService movimientoInventarioService;

    public VentaService(
            VentaRepository ventaRepository,
            DetalleVentaRepository detalleVentaRepository,
            ProductoRepository productoRepository,
            ClienteRepository clienteRepository,
            MovimientoInventarioService movimientoInventarioService) {
        this.ventaRepository = ventaRepository;
        this.detalleVentaRepository = detalleVentaRepository;
        this.productoRepository = productoRepository;
        this.clienteRepository = clienteRepository;
        this.movimientoInventarioService = movimientoInventarioService;
    }

    @Transactional(readOnly = true)
    public List<VentaResponseDTO> listar() {
        return ventaRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public VentaResponseDTO obtenerPorId(Long id) {
        Venta venta = ventaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Venta no encontrada con id: " + id));

        return toResponseDTO(venta);
    }

    public VentaResponseDTO crear(VentaRequestDTO dto) {
        validar(dto);

        Cliente cliente = null;
        if (dto.getClienteId() != null) {
            cliente = clienteRepository.findById(dto.getClienteId())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Cliente no encontrado con id: " + dto.getClienteId()));
        }

        Venta venta = new Venta();
        venta.setFecha(LocalDateTime.now());
        venta.setCliente(cliente);
        venta.setTotal(BigDecimal.ZERO);

        Venta ventaGuardada = ventaRepository.save(venta);

        BigDecimal total = BigDecimal.ZERO;

        for (DetalleVentaRequestDTO detalleDTO : dto.getDetalles()) {
            Producto producto = productoRepository.findById(detalleDTO.getProductoId())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Producto no encontrado con id: " + detalleDTO.getProductoId()));

            Integer stockActual = producto.getStock() != null ? producto.getStock() : 0;

            if (stockActual < detalleDTO.getCantidad()) {
                throw new IllegalArgumentException(
                        "Stock insuficiente para el producto: " + producto.getNombre());
            }

            BigDecimal subtotal = detalleDTO.getPrecioUnitario()
                    .multiply(BigDecimal.valueOf(detalleDTO.getCantidad()));

            DetalleVenta detalle = new DetalleVenta();
            detalle.setVenta(ventaGuardada);
            detalle.setProducto(producto);
            detalle.setCantidad(detalleDTO.getCantidad());
            detalle.setPrecioUnitario(detalleDTO.getPrecioUnitario());
            detalle.setSubtotal(subtotal);

            detalleVentaRepository.save(detalle);

            producto.setStock(stockActual - detalleDTO.getCantidad());
            productoRepository.save(producto);

            movimientoInventarioService.registrarMovimiento(
                    producto,
                    "SALIDA",
                    detalleDTO.getCantidad(),
                    "Venta #" + ventaGuardada.getId(),
                    cliente != null
                            ? "Salida por venta al cliente " + cliente.getNombre()
                            : "Salida por venta"
            );

            total = total.add(subtotal);
        }

        ventaGuardada.setTotal(total);
        ventaRepository.save(ventaGuardada);

        return toResponseDTO(ventaGuardada);
    }

    private void validar(VentaRequestDTO dto) {
        if (dto.getDetalles() == null || dto.getDetalles().isEmpty()) {
            throw new IllegalArgumentException("La venta debe tener al menos un detalle");
        }

        Set<Long> productos = new HashSet<>();

        for (DetalleVentaRequestDTO detalle : dto.getDetalles()) {
            if (detalle.getProductoId() == null) {
                throw new IllegalArgumentException("El producto es obligatorio en cada detalle");
            }

            if (!productos.add(detalle.getProductoId())) {
                throw new IllegalArgumentException("No se puede repetir el mismo producto en la venta");
            }

            if (detalle.getCantidad() == null || detalle.getCantidad() <= 0) {
                throw new IllegalArgumentException("La cantidad debe ser mayor a 0");
            }

            if (detalle.getPrecioUnitario() == null
                    || detalle.getPrecioUnitario().compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalArgumentException("El precio unitario debe ser mayor a 0");
            }
        }
    }

    private VentaResponseDTO toResponseDTO(Venta venta) {
        List<DetalleVentaResponseDTO> detalles = detalleVentaRepository.findByVentaId(venta.getId())
                .stream()
                .map(detalle -> new DetalleVentaResponseDTO(
                        detalle.getId(),
                        detalle.getProducto().getId(),
                        detalle.getProducto().getNombre(),
                        detalle.getCantidad(),
                        detalle.getPrecioUnitario(),
                        detalle.getSubtotal()))
                .toList();

        return new VentaResponseDTO(
                venta.getId(),
                venta.getFecha(),
                venta.getCliente() != null ? venta.getCliente().getId() : null,
                venta.getCliente() != null ? venta.getCliente().getNombre() : null,
                venta.getTotal(),
                detalles);
    }
}