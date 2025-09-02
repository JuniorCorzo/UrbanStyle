package io.github.juniorcorzo.UrbanStyle.product.application.service.aggregations;

import io.github.juniorcorzo.UrbanStyle.order.domain.enums.OrderStatus;
import io.github.juniorcorzo.UrbanStyle.product.domain.adapter.dtos.ProductAggregationDomain;
import io.github.juniorcorzo.UrbanStyle.product.domain.adapter.dtos.ProductInventoryDTO;
import io.github.juniorcorzo.UrbanStyle.product.domain.entities.ProductEntity;
import io.github.juniorcorzo.UrbanStyle.product.domain.entities.StockMovementsEntity;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductAggregationService {
    private final MongoTemplate mongoTemplate;


    public boolean existsByIdAndSku(final String productId, final String sku) {
        final Query query = Query.query(Criteria.where("_id").is(productId).and("attributes.sku").is(sku));

        return this.mongoTemplate.exists(query, ProductEntity.class);
    }

    public List<ProductAggregationDomain> productsGroupedByCategory() {
        final LookupOperation orderLookup = this.createOrderLookup();
        final GroupOperation groupByCategory = this.createGroupByCategory();
        final ArrayOperators.Filter ordersFilter = this.createOrdersFilter();
        final ProjectionOperation projection = this.createProjectionWithSoldCount(ordersFilter);

        final Aggregation aggregation = Aggregation.newAggregation(
                orderLookup,
                Aggregation.addFields()
                        .addFieldWithValue("originalDoc", "$$ROOT")
                        .build(),
                Aggregation.unwind("categories"),
                groupByCategory,
                projection,
                Aggregation.sort(
                        Sort.by(Sort.Direction.DESC, "sold")
                ),
                UnsetOperation.unset("sold", "products.orders")
        );

        AggregationResults<ProductAggregationDomain> aggregationResults = mongoTemplate.aggregate(aggregation, "products", ProductAggregationDomain.class);
        return aggregationResults.getMappedResults();
    }

    public List<ProductInventoryDTO> productsInventory() {
        final LookupOperation productLookup = this.getProductLookup();
        final GroupOperation groupProductMovements = this.getGroupProductMovements();
        final ProjectionOperation projection = this.getProductInventoryProjection();

        final Aggregation aggregation = Aggregation.newAggregation(
                productLookup,
                Aggregation.unwind("product"),
                groupProductMovements,
                UnsetOperation.unset("$movements.product"),
                projection
        );

        AggregationResults<ProductInventoryDTO> aggregationResults = mongoTemplate.aggregate(aggregation, StockMovementsEntity.class, ProductInventoryDTO.class);
        return aggregationResults.getMappedResults();
    }

    @NotNull
    private ProjectionOperation getProductInventoryProjection() {
        return Aggregation.project("$movements")
                .andExclude("_id")
                .and("$_id.productId")
                .as("productId")
                .and("$_id.sku")
                .as("sku")
                .and("$_id.product")
                .as("product");
    }

    @NotNull
    private GroupOperation getGroupProductMovements() {
        return Aggregation.group(Fields.from(
                Fields.field("productId", "$productId"),
                Fields.field("sku", "$sku"),
                Fields.field("product", "$product.name")
        )).push("$$ROOT").as("movements");
    }

    @NotNull
    private LookupOperation getProductLookup() {
        return LookupOperation.newLookup()
                .from("products")
                .localField("productId")
                .foreignField("_id")
                .as("product");
    }

    private LookupOperation createOrderLookup() {
        return LookupOperation.newLookup()
                .from("orders")
                .localField("_id")
                .foreignField("products.productId")
                .as("orders");
    }

    private GroupOperation createGroupByCategory() {
        return Aggregation.group(Fields.from(
                        Fields.field("categoryId", "$categories.categoryId"),
                        Fields.field("name", "$categories.name")
                ))
                .push("$originalDoc").as("products");
    }

    private ArrayOperators.Filter createOrdersFilter() {
        return ArrayOperators.Filter
                .filter("$$orders.products")
                .as("this")
                .by(createOrderFilterCondition());
    }

    private BooleanOperators.And createOrderFilterCondition() {
        return BooleanOperators.And.and(
                ComparisonOperators.Eq.valueOf("$$orders.status").equalTo(OrderStatus.DELIVERED.name()),
                ComparisonOperators.Eq.valueOf("$$this.productId").equalTo("$$product._id")
        );
    }

    private ProjectionOperation createProjectionWithSoldCount(ArrayOperators.Filter ordersFilter) {
        return Aggregation.project("$products")
                .andExclude("_id")
                .and("$_id.name")
                .as("category")
                .and(calculateTotalSoldQuantity(ordersFilter))
                .as("sold");
    }

    private AccumulatorOperators.Sum calculateTotalSoldQuantity(ArrayOperators.Filter ordersFilter) {
        return AccumulatorOperators.Sum.sumOf(
                createProductsMapping(ordersFilter)
        );
    }

    private VariableOperators.Map createProductsMapping(ArrayOperators.Filter ordersFilter) {
        return VariableOperators.Map.itemsOf("$products")
                .as("product")
                .andApply(createOrdersMapping(ordersFilter));
    }

    private AccumulatorOperators.Sum createOrdersMapping(ArrayOperators.Filter ordersFilter) {
        return AccumulatorOperators.Sum.sumOf(
                VariableOperators.Map.itemsOf("$$product.orders")
                        .as("orders")
                        .andApply(createQuantityReduction(ordersFilter))
        );
    }

    private AccumulatorOperators.Sum createQuantityReduction(ArrayOperators.Filter ordersFilter) {
        return AccumulatorOperators.Sum.sumOf(
                ArrayOperators.Reduce.arrayOf(ordersFilter)
                        .withInitialValue(0)
                        .reduce(createQuantityAddition())
        );
    }

    private ArithmeticOperators.Add createQuantityAddition() {
        return ArithmeticOperators.Add.valueOf("$$value")
                .add("$$this.quantity");
    }
}
