package io.github.juniorcorzo.UrbanStyle.application.service.aggregations;

import io.github.juniorcorzo.UrbanStyle.domain.dtos.ProductAggregationDomain;
import io.github.juniorcorzo.UrbanStyle.domain.enums.OrderStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductAggregationService {
    private final MongoTemplate mongoTemplate;

    public List<ProductAggregationDomain> productsGroupedByCategory() {
        final LookupOperation orderLookup = createOrderLookup();
        final GroupOperation groupByCategory = createGroupByCategory();
        final ArrayOperators.Filter ordersFilter = createOrdersFilter();
        final ProjectionOperation projection = createProjectionWithSoldCount(ordersFilter);

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
