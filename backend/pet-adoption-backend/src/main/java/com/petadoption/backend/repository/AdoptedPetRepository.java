package com.petadoption.backend.repository;

import com.petadoption.backend.entity.AdoptedPet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AdoptedPetRepository extends JpaRepository<AdoptedPet, Long> {
    List<AdoptedPet> findAllByOrderByAdoptedAtDesc();
}
