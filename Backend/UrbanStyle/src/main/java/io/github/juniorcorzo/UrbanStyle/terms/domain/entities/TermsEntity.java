package io.github.juniorcorzo.UrbanStyle.terms.domain.entities;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;

import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import lombok.Builder;
import lombok.Data;

@Document("terms")
@Data
@Builder
public class TermsEntity {
  @MongoId
  private String id;
  private String content;
  private boolean valid;
  @Indexed(unique = true)
  private String version;
  @CreatedDate
  private LocalDateTime publishedAt;
}
