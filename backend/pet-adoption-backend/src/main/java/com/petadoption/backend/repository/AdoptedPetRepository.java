package com.petadoption.backend.repository;

import com.petadoption.backend.entity.AdoptedPet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdoptedPetRepository extends JpaRepository<AdoptedPet, Long> {
}
