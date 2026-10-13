package com.petadoption.backend.service;

import com.petadoption.backend.entity.AdoptedPet;
import com.petadoption.backend.entity.Pet;
import com.petadoption.backend.repository.AdoptedPetRepository;
import com.petadoption.backend.repository.PetRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;

@Service
public class AdoptionService {

    private final PetRepository petRepository;
    private final AdoptedPetRepository adoptedPetRepository;

    public AdoptionService(PetRepository petRepository, AdoptedPetRepository adoptedPetRepository) {
        this.petRepository = petRepository;
        this.adoptedPetRepository = adoptedPetRepository;
    }

    @Transactional
    public void adoptPet(Long petId, Jwt adopter) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pet not found."));

        adoptedPetRepository.save(new AdoptedPet(
                pet,
                adopter.getSubject(),
                adopter.getClaimAsString("email"),
                Instant.now()));
        petRepository.delete(pet);
    }
}
