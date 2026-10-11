package com.petadoption.backend;

import com.petadoption.backend.repository.PetRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;

@SpringBootTest
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
}
