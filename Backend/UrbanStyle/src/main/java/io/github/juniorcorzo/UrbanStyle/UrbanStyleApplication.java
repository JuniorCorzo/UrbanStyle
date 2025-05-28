package io.github.juniorcorzo.UrbanStyle;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableTransactionManagement
public class UrbanStyleApplication {

	public static void main(String[] args) {
		SpringApplication.run(UrbanStyleApplication.class, args);
	}

}
