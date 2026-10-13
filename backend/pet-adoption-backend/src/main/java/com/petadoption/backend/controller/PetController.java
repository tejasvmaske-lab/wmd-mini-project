package com.petadoption.backend.controller;

import com.petadoption.backend.entity.Pet;
import com.petadoption.backend.repository.PetRepository;
import com.petadoption.backend.service.AdoptionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pets")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class PetController {

    private final PetRepository petRepository;
    private final AdoptionService adoptionService;

    public PetController(PetRepository petRepository, AdoptionService adoptionService) {
        this.petRepository = petRepository;
        this.adoptionService = adoptionService;
    }

    // CREATE
    @PostMapping
    public Pet addPet(@RequestBody Pet pet) {
        return petRepository.save(pet);
    }

    // READ ALL
    @GetMapping
    public List<Pet> getAllPets() {
        return petRepository.findAll();
    }

    // READ ONE
    @GetMapping("/{id}")
    public Pet getPetById(@PathVariable Long id) {
        return petRepository.findById(id).orElse(null);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Pet updatePet(@PathVariable Long id, @RequestBody Pet pet) {

        Pet existingPet = petRepository.findById(id).orElse(null);

        if (existingPet != null) {
            existingPet.setPetName(pet.getPetName());
            existingPet.setPetType(pet.getPetType());
            existingPet.setAge(pet.getAge());
            existingPet.setImageURL(pet.getImageURL());

            return petRepository.save(existingPet);
        }

        return null;
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePet(@PathVariable Long id, @AuthenticationPrincipal Jwt adopter) {
        adoptionService.adoptPet(id, adopter);
        return ResponseEntity.noContent().build();
    }
}