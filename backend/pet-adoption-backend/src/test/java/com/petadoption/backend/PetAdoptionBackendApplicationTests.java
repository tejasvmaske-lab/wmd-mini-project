package com.petadoption.backend;

import com.petadoption.backend.entity.AdoptedPet;
import com.petadoption.backend.entity.Pet;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.petadoption.backend.repository.AdoptedPetRepository;
import com.petadoption.backend.repository.PetRepository;
import com.petadoption.backend.service.AdoptionService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.test.web.servlet.MockMvc;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = {
		"spring.security.oauth2.resourceserver.jwt.issuer-uri=https://example.auth0.com/",
		"auth0.jwks-uri=https://example.auth0.com/.well-known/jwks.json",
		"auth0.audience=https://api.pawfect.local"
})
@AutoConfigureMockMvc
class PetAdoptionBackendApplicationTests {

	@Autowired
	private PetRepository petRepository;

	@Autowired
	private AdoptedPetRepository adoptedPetRepository;

	@Autowired
	private AdoptionService adoptionService;

	@Autowired
	private MockMvc mockMvc;

	@Value("${admin.jwt-secret}")
	private String adminJwtSecret;

	@Test
	void contextLoads() {
		assertThat(petRepository.findAll())
				.extracting("petName")
				.containsExactlyInAnyOrder("Charlie", "Bucky", "Rio", "Max", "Norris", "Olive", "Abc");
	}

	@Test
	void allowsViteOnPort5174ToLoadPets() throws Exception {
		mockMvc.perform(get("/pets").header("Origin", "http://localhost:5174"))
				.andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5174"));
	}

	@Test
	void requiresAnAccessTokenToAdoptAPet() throws Exception {
		mockMvc.perform(delete("/pets/1"))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void requiresAdminAuthenticationToReadAdoptionHistory() throws Exception {
		mockMvc.perform(get("/adopted-pets"))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void allowsAdminToReadAdoptionHistory() throws Exception {
		Pet pet = petRepository.save(new Pet("History test", "Dog", 8, ""));
		AdoptedPet adoptedPet = adoptedPetRepository.save(new AdoptedPet(
				pet, "auth0|history-user", "history@example.com", Instant.now()));

		try {
			mockMvc.perform(get("/adopted-pets")
							.header("Authorization", "Bearer " + createAdminToken()))
					.andExpect(status().isOk())
					.andExpect(jsonPath("$[0].petName").value("History test"))
					.andExpect(jsonPath("$[0].adopterEmail").value("history@example.com"));
		} finally {
			adoptedPetRepository.delete(adoptedPet);
			petRepository.delete(pet);
		}
	}

	@Test
	void storesUploadedPetImageDataLongerThanAVarchar() {
		String imageData = "data:image/png;base64," + "A".repeat(4096);
		Pet pet = petRepository.save(new Pet("Photo test", "Dog", 1, imageData));

		try {
			assertThat(petRepository.findById(pet.getId()).orElseThrow().getImageURL())
					.isEqualTo(imageData);
		} finally {
			petRepository.delete(pet);
		}
	}

	@Test
	void recordsAdopterAndPetBeforeRemovingPetFromAvailablePets() {
		Pet pet = petRepository.save(new Pet("Adoption test", "Cat", 6, ""));
		Jwt adopter = Jwt.withTokenValue("test-token")
				.header("alg", "none")
				.subject("auth0|test-user")
				.claim("email", "adopter@example.com")
				.build();

		try {
			adoptionService.adoptPet(pet.getId(), adopter);

			assertThat(petRepository.existsById(pet.getId())).isFalse();
			assertThat(adoptedPetRepository.findAll())
					.anySatisfy(adoption -> {
						assertThat(adoption.getPetId()).isEqualTo(pet.getId());
						assertThat(adoption.getPetName()).isEqualTo("Adoption test");
						assertThat(adoption.getAdopterId()).isEqualTo("auth0|test-user");
						assertThat(adoption.getAdopterEmail()).isEqualTo("adopter@example.com");
						assertThat(adoption.getAdoptedAt()).isNotNull();
					});
		} finally {
			adoptedPetRepository.deleteAll();
			petRepository.deleteById(pet.getId());
		}
	}

	private String createAdminToken() throws Exception {
		Instant now = Instant.now();
		JWTClaimsSet claims = new JWTClaimsSet.Builder()
				.subject("admin")
				.claim("role", "ADMIN")
				.issueTime(Date.from(now))
				.expirationTime(Date.from(now.plusSeconds(60)))
				.build();
		SignedJWT token = new SignedJWT(new JWSHeader(JWSAlgorithm.HS256), claims);
		token.sign(new MACSigner(adminJwtSecret.getBytes(StandardCharsets.UTF_8)));
		return token.serialize();
	}
}
