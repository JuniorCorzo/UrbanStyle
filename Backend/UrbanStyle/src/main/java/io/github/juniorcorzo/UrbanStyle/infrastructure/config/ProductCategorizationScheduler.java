package io.github.juniorcorzo.UrbanStyle.infrastructure.config;

import io.github.juniorcorzo.UrbanStyle.domain.enums.DocumentsName;
import io.github.juniorcorzo.UrbanStyle.domain.exceptions.DocumentNotFound;
import io.github.juniorcorzo.UrbanStyle.domain.repository.CategoriesRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.Document;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Collections;


@Component
@RequiredArgsConstructor
@Slf4j
public class ProductCategorizationScheduler {
    private final CategoriesRepository categoriesRepository;
    private final MongoTemplate mongoTemplate;
    private static final String POPULAR_CATEGORY_ID = "68a11eafe8d5abf2ff67d53b";
    private static final int TOP_PRODUCTS_LIMIT = 10;

    /**
     * Initializes the `ProductCategorizationScheduler` class by executing
     * the product categorization process via the `executeProductCategorization` method.
     *
     * This method is annotated with `@PostConstruct`, ensuring that it is automatically
     * invoked after the bean's properties have been initialized by the Spring framework.
     * The product categorization process involves categorizing products based on
     * delivered order data and is a critical step in setting up the application's
     * initial state or re-processing data as necessary.
     */
    @PostConstruct
    private void init() {
        executeProductCategorization();
    }

    /**
     * Executes the product categorization process and updates the product categories
     * in the database based on the sales data. This method is scheduled to run every
     * 12 hours as defined by the cron expression.
     * <p>
     * The process includes:
     * 1. Filtering delivered orders from the order's collection.
     * 2. Unwinding the product's array in each order document.
     * 3. Grouping products by their ID and summing their sold quantities.
     * 4. Sorting products in descending order by the number of units sold.
     * 5. Limiting the result to a predefined number of top products.
     * 6. Merging the categorized product information back into the product collection.
     * <p>
     * Logs are generated for the start and successful completion of this process.
     * <p>
     * Dependencies:
     * - MongoDB for reading and updating the order and products collections.
     * - Methods such as {@link #createDeliveredOrdersFilter()},
     * {@link #createProductSalesGrouping()}, and {@link #createCategoryMergeOperation()}
     * to construct various parts of the aggregation pipeline.
     * <p>
     * Errors:
     * - If the category document for categorization cannot be retrieved from the database, a
     * {@link DocumentNotFound} exception is thrown during the merge operation preparation.
     */
    @Scheduled(cron = "0 0 */12 * * ?")
    private void executeProductCategorization() {
        this.executeRemoveProductCategorization();
        log.info("Product categorization started");

        final MatchOperation deliveredOrdersFilter = createDeliveredOrdersFilter();
        final GroupOperation productSalesGrouping = createProductSalesGrouping();
        final MergeOperation categoryMergeOperation = createCategoryMergeOperation();

        final Aggregation productCategorizationPipeline = Aggregation.newAggregation(deliveredOrdersFilter, Aggregation.unwind("$products"), productSalesGrouping, Aggregation.sort(Sort.Direction.DESC, "$sold"), Aggregation.limit(TOP_PRODUCTS_LIMIT), categoryMergeOperation);

        AggregationResults<Document> categorizationResult = mongoTemplate.aggregate(productCategorizationPipeline, "orders", Document.class);

        log.info("Product categorization executed successfully: {}", categorizationResult);
    }

    private void executeRemoveProductCategorization() {
        log.info("Product categorization removed");
        mongoTemplate.getCollection("products").updateMany(new Document("categories.categoryId", POPULAR_CATEGORY_ID), new Document("$pull", new Document("categories", new Document("categoryId", POPULAR_CATEGORY_ID))));
        log.info("Product categorization removed successfully");
    }

    /**
     * Creates a filter to match delivered orders within a specific date range.
     * The filter ensures that the order status is "DELIVERED" and the order date is
     * within the last month but excludes the current month.
     *
     * @return a MatchOperation instance representing the filter for delivered orders
     * within the specified date range.
     */
    private MatchOperation createDeliveredOrdersFilter() {
        return Aggregation.match(Criteria.where("status").is("DELIVERED").andOperator(Criteria.expr(BooleanOperators.And.and(ComparisonOperators.Gte.valueOf("$orderDate").greaterThanEqualTo(DateOperators.DateTrunc.truncateValue(DateOperators.DateSubtract.subtractValue(1, "month").fromDateOf("$$NOW")).to("month")), ComparisonOperators.Lt.valueOf("$orderDate").lessThan(DateOperators.DateTrunc.truncateValue("$$NOW").to("month"))))));
    }

    /**
     * Creates a grouping operation for aggregating product sales data.
     * This method groups by the product ID and calculates the total
     * quantity sold for each product.
     *
     * @return a GroupOperation that groups sales data by product ID
     * and computes the total quantity sold.
     */
    private GroupOperation createProductSalesGrouping() {
        return Aggregation.group("$products.productId").sum("$products.quantity").as("sold");
    }

    /**
     * Creates a {@link MergeOperation} to merge an aggregated result of top products with the existing product categories collection.
     * The operation updates the "categories" and "updateAt" fields if a match is found on the "_id" field, and discards documents
     * when no match is found.
     * <p>
     * This method utilizes a {@link Document} generated by {@code createCategoryDocument()} to define a category structure
     * that is added to the list of categories in the update operation. The categories are aggregated using a set union operation to
     * ensure uniqueness of values.
     *
     * @return a {@link MergeOperation} object configured to merge categorized products into the "products" collection.
     */
    private MergeOperation createCategoryMergeOperation() {
        final Document categoryDocument = createCategoryDocument();

        return MergeOperation.builder().intoCollection("products").on("$_id").whenMatched(MergeOperation.WhenDocumentsMatch.updateWith(Aggregation.newUpdate().set("categories").toValue(SetOperators.SetUnion.arrayAsSet("$categories").union(AggregationExpression.from(() -> new Document("$literal", Collections.singletonList(categoryDocument))))).set("updateAt").toValue("$$NOW"))).whenNotMatched(MergeOperation.WhenDocumentsDontMatch.discardDocument()).build();
    }

    /**
     * Creates a {@link Document} for a specific category identified by the predefined
     * {@code POPULAR_CATEGORY_ID}. The created document includes the category's ID and name.
     * If the category is not found, throws a {@link DocumentNotFound} exception.
     *
     * @return a {@link Document} containing the category's ID and name.
     * @throws DocumentNotFound if the category with the predefined ID is not found.
     */
    private Document createCategoryDocument() {
        return this.categoriesRepository.findById(POPULAR_CATEGORY_ID).map(category -> new Document().append("categoryId", category.getId()).append("name", category.getName())).orElseThrow(() -> new DocumentNotFound(DocumentsName.CATEGORY, POPULAR_CATEGORY_ID));
    }
}
