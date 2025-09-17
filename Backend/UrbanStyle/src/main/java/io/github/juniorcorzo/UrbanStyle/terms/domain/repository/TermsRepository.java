package io.github.juniorcorzo.UrbanStyle.terms.domain.repository;

import java.util.Optional;

import io.github.juniorcorzo.UrbanStyle.terms.domain.projections.ObtainCurrentVersion;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;
import org.springframework.stereotype.Repository;

import io.github.juniorcorzo.UrbanStyle.terms.domain.entities.TermsEntity;

@Repository
public interface TermsRepository extends MongoRepository<TermsEntity, String> {
  @Query(value = "{ valid: true }")
  Optional<TermsEntity> findCurrentTerms();

  @Query(value = "{ version: ?0 }")
  Optional<TermsEntity> findTermsByVersion(String version);

  @Query(value = "{ valid: true }")
  Optional<ObtainCurrentVersion> findCurrentVersion();

  @Query("{ valid: true }")
  @Update("{ $set: { valid: false } }")
  void removeValid();


}
