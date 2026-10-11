package com.petadoption.backend;

import com.petadoption.backend.entity.Pet;
import com.petadoption.backend.repository.PetRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
public class PetDataInitializer implements CommandLineRunner {

    private final PetRepository petRepository;
    private final ObjectMapper objectMapper;

    public PetDataInitializer(PetRepository petRepository, ObjectMapper objectMapper) {
        this.petRepository = petRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    public void run(String... args) throws IOException {
        if (petRepository.count() > 0) {
            return;
        }

        JsonNode seedPets = objectMapper.readTree(new ClassPathResource("db.json").getInputStream()).path("pets");
        if (!seedPets.isArray()) {
            throw new IllegalStateException("The db.json seed file must contain a pets array.");
        }

        List<Pet> pets = new ArrayList<>();
        for (JsonNode seedPet : seedPets) {
            String petName = requiredText(seedPet, "petName");
            String petType = requiredText(seedPet, "petType");
            String ageValue = requiredText(seedPet, "age");
            int age;
            try {
                age = Integer.parseInt(ageValue);
            } catch (NumberFormatException exception) {
                throw new IllegalStateException("Invalid age for pet " + petName + " in db.json.", exception);
            }

            pets.add(new Pet(petName, petType, age, seedPet.path("imageURL").asText("")));
        }

        petRepository.saveAll(pets);
    }

    private String requiredText(JsonNode pet, String field) {
        JsonNode value = pet.get(field);
        if (value == null || value.isNull() || value.asText().isBlank()) {
            throw new IllegalStateException("Missing " + field + " in a db.json pet entry.");
        }
        return value.asText();
    }
}
