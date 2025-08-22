package io.github.juniorcorzo.UrbanStyle.product.domain.repository;

import io.github.juniorcorzo.UrbanStyle.product.domain.entities.StockMovementsEntity;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StockMovementsRepository extends MongoRepository<StockMovementsEntity,ObjectId> {
}
