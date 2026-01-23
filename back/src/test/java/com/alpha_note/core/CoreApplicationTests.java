package com.alpha_note.core;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
@ActiveProfiles("test")
class CoreApplicationTests {

	@Test
	void contextLoads() {
		// Spring Context가 정상적으로 로드되는지 확인
	}

}
