package com.petadoption.backend.controller;

import com.petadoption.backend.entity.AdoptedPet;
import com.petadoption.backend.repository.AdoptedPetRepository;
import com.petadoption.backend.service.AdminTokenService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/adopted-pets")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class AdoptedPetController {

    private final AdoptedPetRepository adoptedPetRepository;
    private final AdminTokenService adminTokenService;

    public AdoptedPetController(
            AdoptedPetRepository adoptedPetRepository,
            AdminTokenService adminTokenService) {
        this.adoptedPetRepository = adoptedPetRepository;
        this.adminTokenService = adminTokenService;
    }

    @GetMapping
    public List<AdoptedPet> getAdoptedPets(@RequestHeader(value = "Authorization", required = false) String authorization) {
        adminTokenService.requireAdmin(authorization);
        return adoptedPetRepository.findAllByOrderByAdoptedAtDesc();
    }
}
