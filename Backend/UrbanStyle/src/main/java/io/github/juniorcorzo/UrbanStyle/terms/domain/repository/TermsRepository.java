package io.github.juniorcorzo.UrbanStyle.terms.domain.repository;

import java.util.List;
import java.util.Optional;

import io.github.juniorcorzo.UrbanStyle.terms.domain.projections.ObtainVersion;
import io.github.juniorcorzo.UrbanStyle.terms.domain.projections.TermsVersions;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;
import org.springframework.stereotype.Repository;

import io.github.juniorcorzo.UrbanStyle.terms.domain.entities.TermsEntity;

@Repository
public interface TermsRepository extends MongoRepository<TermsEntity, String> {
  @Query(value = "{ valid: true }")
  Optional<TermsEntity> findCurrentTerms();

  @Query(value = "{}", fields = "{ version: 1, publishedAt: 1, _id: 0 }")
  Optional<List<TermsVersions>> findAllVersions();

  @Query(value = "{ version: ?0 }")
  Optional<TermsEntity> findTermsByVersion(String version);

  @Query(value = "{ valid: true }")
  Optional<ObtainVersion> findCurrentVersion();

  @Query("{ valid: true }")
  @Update("{ $set: { valid: false } }")
  void removeValid();


}
