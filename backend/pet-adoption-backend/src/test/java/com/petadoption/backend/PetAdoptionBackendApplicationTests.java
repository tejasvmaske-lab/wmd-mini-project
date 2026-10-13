package com.petadoption.backend;

import com.petadoption.backend.entity.Pet;
import com.petadoption.backend.repository.PetRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
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
	private MockMvc mockMvc;

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
}
