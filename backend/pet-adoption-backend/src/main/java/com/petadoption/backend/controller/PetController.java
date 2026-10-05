package com.petadoption.backend.controller;

import com.petadoption.backend.entity.Pet;
import com.petadoption.backend.repository.PetRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pets")
public class PetController {

    private final PetRepository petRepository;

    public PetController(PetRepository petRepository) {
        this.petRepository = petRepository;
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
    public String deletePet(@PathVariable Long id) {

        petRepository.deleteById(id);

        return "Pet deleted successfully";
    }
}