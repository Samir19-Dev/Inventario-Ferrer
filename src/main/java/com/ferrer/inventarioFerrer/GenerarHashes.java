package com.ferrer.inventarioFerrer;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GenerarHashes {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        System.out.println("admin123 -> " + encoder.encode("admin123"));
        System.out.println("bodega123 -> " + encoder.encode("bodega123"));
        System.out.println("vendedor123 -> " + encoder.encode("vendedor123"));
    }
}