package com.petadoption.backend.repository;

import com.petadoption.backend.entity.Pet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PetRepository extends JpaRepository<Pet, Long> {
}