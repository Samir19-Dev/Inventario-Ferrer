package com.ferrer.inventarioFerrer.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ferrer.inventarioFerrer.DTO.AuthRequest;
import com.ferrer.inventarioFerrer.DTO.AuthResponse;
import com.ferrer.inventarioFerrer.DTO.ChangePasswordRequest;
import com.ferrer.inventarioFerrer.entity.Usuario;
import com.ferrer.inventarioFerrer.repository.UsuarioRepository;
import com.ferrer.inventarioFerrer.security.JwtService;

@Service
public class AuthService {

	private final UsuarioRepository usuarioRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;
	private final AuthenticationManager authenticationManager;

	public AuthService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, JwtService jwtService,
			AuthenticationManager authenticationManager) {
		this.usuarioRepository = usuarioRepository;
		this.passwordEncoder = passwordEncoder;
		this.jwtService = jwtService;
		this.authenticationManager = authenticationManager;
	}

	public String register(AuthRequest request) {
		if (request.getUsername() == null || request.getUsername().isBlank() || request.getPassword() == null
				|| request.getPassword().isBlank()) {
			throw new RuntimeException("Usuario y contraseña obligatorios");
		}

		String username = request.getUsername().trim().toLowerCase();

		if (usuarioRepository.existsByUsername(username)) {
			throw new RuntimeException("Usuario ya existe");
		}

		Usuario usuario = new Usuario();
		usuario.setUsername(username);
		usuario.setPassword(passwordEncoder.encode(request.getPassword()));
		usuario.setRole("ROLE_VENDEDOR");
		usuario.setMustChangePassword(true);

		usuarioRepository.save(usuario);

		return "Usuario registrado correctamente";
	}

	public AuthResponse login(AuthRequest request) {
		if (request.getUsername() == null || request.getUsername().isBlank() || request.getPassword() == null
				|| request.getPassword().isBlank()) {
			throw new RuntimeException("Usuario y contraseña obligatorios");
		}

		String username = request.getUsername().trim().toLowerCase();

		authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, request.getPassword()));

		Usuario usuario = usuarioRepository.findByUsername(username)
				.orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

		String token = jwtService.generateToken(usuario.getUsername(), usuario.getRole());

		return new AuthResponse(token, usuario.getUsername(), usuario.getRole(), usuario.getMustChangePassword());
	}

	public String changePassword(String username, ChangePasswordRequest request) {
		if (request.getCurrentPassword() == null || request.getCurrentPassword().isBlank()
				|| request.getNewPassword() == null || request.getNewPassword().isBlank()) {
			throw new RuntimeException("Debes enviar la contraseña actual y la nueva");
		}

		if (request.getNewPassword().length() < 6) {
			throw new RuntimeException("La nueva contraseña debe tener al menos 6 caracteres");
		}

		Usuario usuario = usuarioRepository.findByUsername(username)
				.orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

		if (!passwordEncoder.matches(request.getCurrentPassword(), usuario.getPassword())) {
			throw new RuntimeException("La contraseña actual no es correcta");
		}

		usuario.setPassword(passwordEncoder.encode(request.getNewPassword()));
		usuario.setMustChangePassword(false);
		usuarioRepository.save(usuario);

		return "Contraseña actualizada correctamente";
	}
}