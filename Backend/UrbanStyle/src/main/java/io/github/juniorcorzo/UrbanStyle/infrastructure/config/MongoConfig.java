package io.github.juniorcorzo.UrbanStyle.infrastructure.config;

import io.github.juniorcorzo.UrbanStyle.domain.repository.ReportRepository;
import io.github.juniorcorzo.UrbanStyle.infrastructure.repository.ReportRepositoryImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.MongoTransactionManager;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.convert.MongoCustomConversions;
import org.springframework.data.mongodb.core.messaging.DefaultMessageListenerContainer;
import org.springframework.data.mongodb.core.messaging.MessageListenerContainer;

import java.util.List;

@Configuration
@SuppressWarnings("unused")
public class MongoConfig {
    @Bean
    MongoTransactionManager transactionManager(MongoDatabaseFactory mongoDatabaseFactory) {
        return new MongoTransactionManager(mongoDatabaseFactory);
    }

    @Bean
    ReportRepository reportRepository(MongoTemplate mongoTemplate) {
        return new ReportRepositoryImpl(mongoTemplate);
    }

    @Bean
    MessageListenerContainer messageListenerContainer(MongoTemplate mongoTemplate) {
        DefaultMessageListenerContainer container = new DefaultMessageListenerContainer(mongoTemplate);
        container.start();

        return container;
    }
}
