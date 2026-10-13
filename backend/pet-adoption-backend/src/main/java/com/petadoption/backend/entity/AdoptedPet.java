package com.petadoption.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "adopted_pets")
public class AdoptedPet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long petId;
    private String petName;
    private String petType;
    private int age;
    private String adopterId;
    private String adopterEmail;
    private Instant adoptedAt;

    public AdoptedPet() {
    }

    public AdoptedPet(Pet pet, String adopterId, String adopterEmail, Instant adoptedAt) {
        this.petId = pet.getId();
        this.petName = pet.getPetName();
        this.petType = pet.getPetType();
        this.age = pet.getAge();
        this.adopterId = adopterId;
        this.adopterEmail = adopterEmail;
        this.adoptedAt = adoptedAt;
    }

    public Long getId() {
        return id;
    }

    public Long getPetId() {
        return petId;
    }

    public String getPetName() {
        return petName;
    }

    public String getPetType() {
        return petType;
    }

    public int getAge() {
        return age;
    }

    public String getAdopterId() {
        return adopterId;
    }

    public String getAdopterEmail() {
        return adopterEmail;
    }

    public Instant getAdoptedAt() {
        return adoptedAt;
    }
}
