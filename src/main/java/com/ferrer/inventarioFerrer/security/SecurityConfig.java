package com.ferrer.inventarioFerrer.security;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;
    private final CustomUserDetailsService userDetailsService;

    public SecurityConfig(JwtFilter jwtFilter, CustomUserDetailsService userDetailsService) {
        this.jwtFilter = jwtFilter;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(authenticationProvider())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/register").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/change-password").authenticated()

                .requestMatchers(HttpMethod.GET, "/api/dashboard/**")
                    .hasAnyRole("ADMIN", "BODEGUERO", "VENDEDOR")

                .requestMatchers(HttpMethod.GET, "/api/categorias/**")
                    .hasAnyRole("ADMIN", "BODEGUERO", "VENDEDOR")
                .requestMatchers(HttpMethod.POST, "/api/categorias/**")
                    .hasAnyRole("ADMIN", "BODEGUERO")
                .requestMatchers(HttpMethod.PUT, "/api/categorias/**")
                    .hasAnyRole("ADMIN", "BODEGUERO")
                .requestMatchers(HttpMethod.DELETE, "/api/categorias/**")
                    .hasRole("ADMIN")

                .requestMatchers(HttpMethod.GET, "/api/productos/**")
                    .hasAnyRole("ADMIN", "BODEGUERO", "VENDEDOR")
                .requestMatchers(HttpMethod.POST, "/api/productos/**")
                    .hasAnyRole("ADMIN", "BODEGUERO")
                .requestMatchers(HttpMethod.PUT, "/api/productos/**")
                    .hasAnyRole("ADMIN", "BODEGUERO")
                .requestMatchers(HttpMethod.DELETE, "/api/productos/**")
                    .hasRole("ADMIN")

                .requestMatchers(HttpMethod.GET, "/api/proveedores/**")
                    .hasAnyRole("ADMIN", "BODEGUERO")
                .requestMatchers(HttpMethod.POST, "/api/proveedores/**")
                    .hasAnyRole("ADMIN", "BODEGUERO")
                .requestMatchers(HttpMethod.PUT, "/api/proveedores/**")
                    .hasAnyRole("ADMIN", "BODEGUERO")
                .requestMatchers(HttpMethod.DELETE, "/api/proveedores/**")
                    .hasRole("ADMIN")

                .requestMatchers(HttpMethod.GET, "/api/clientes/**")
                    .hasAnyRole("ADMIN", "BODEGUERO", "VENDEDOR")
                .requestMatchers(HttpMethod.POST, "/api/clientes/**")
                    .hasAnyRole("ADMIN", "BODEGUERO", "VENDEDOR")
                .requestMatchers(HttpMethod.PUT, "/api/clientes/**")
                    .hasAnyRole("ADMIN", "BODEGUERO", "VENDEDOR")
                .requestMatchers(HttpMethod.DELETE, "/api/clientes/**")
                    .hasAnyRole("ADMIN", "VENDEDOR")

                .requestMatchers(HttpMethod.GET, "/api/compras/**")
                    .hasAnyRole("ADMIN", "BODEGUERO")
                .requestMatchers(HttpMethod.POST, "/api/compras/**")
                    .hasAnyRole("ADMIN", "BODEGUERO")
                .requestMatchers(HttpMethod.PUT, "/api/compras/**")
                    .hasAnyRole("ADMIN", "BODEGUERO")
                .requestMatchers(HttpMethod.DELETE, "/api/compras/**")
                    .hasRole("ADMIN")

                .requestMatchers(HttpMethod.GET, "/api/ventas/**")
                    .hasAnyRole("ADMIN", "BODEGUERO", "VENDEDOR")
                .requestMatchers(HttpMethod.POST, "/api/ventas/**")
                    .hasAnyRole("ADMIN", "VENDEDOR")
                .requestMatchers(HttpMethod.PUT, "/api/ventas/**")
                    .hasAnyRole("ADMIN", "VENDEDOR")
                .requestMatchers(HttpMethod.DELETE, "/api/ventas/**")
                    .hasRole("ADMIN")

                .requestMatchers(HttpMethod.GET, "/api/movimientos-inventario/**")
                    .hasAnyRole("ADMIN", "BODEGUERO")
                .requestMatchers(HttpMethod.POST, "/api/movimientos-inventario/**")
                    .hasAnyRole("ADMIN", "BODEGUERO")
                .requestMatchers(HttpMethod.PUT, "/api/movimientos-inventario/**")
                    .hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/movimientos-inventario/**")
                    .hasRole("ADMIN")

                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}