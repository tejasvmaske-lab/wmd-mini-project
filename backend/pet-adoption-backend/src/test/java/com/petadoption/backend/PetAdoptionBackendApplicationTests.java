package com.petadoption.backend;

import com.petadoption.backend.repository.PetRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class PetAdoptionBackendApplicationTests {

	@Autowired
	private PetRepository petRepository;

	@Test
	void contextLoads() {
		assertThat(petRepository.findAll())
				.extracting("petName")
				.containsExactlyInAnyOrder("Charlie", "Bucky", "Rio", "Max", "Norris", "Olive", "Abc");
	}
}
