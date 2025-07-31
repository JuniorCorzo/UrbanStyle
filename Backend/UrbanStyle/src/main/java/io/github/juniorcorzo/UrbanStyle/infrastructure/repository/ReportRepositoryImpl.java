package io.github.juniorcorzo.UrbanStyle.infrastructure.repository;

import io.github.juniorcorzo.UrbanStyle.domain.dtos.CategoryReportSalesDTO;
import io.github.juniorcorzo.UrbanStyle.domain.dtos.ProductReportSalesDTO;
import io.github.juniorcorzo.UrbanStyle.domain.dtos.ReportSalesDTO;
import io.github.juniorcorzo.UrbanStyle.domain.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.bson.Document;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;

import java.util.Collections;
import java.util.List;

@RequiredArgsConstructor
public class ReportRepositoryImpl implements ReportRepository {
    private final MongoTemplate mongoTemplate;


    @Override
    public List<ProductReportSalesDTO> findProductsMoreSold() {
        final GroupOperation productDetails = getProductDetails();
        final GroupOperation calculateProductIncome = getProductIncome();
        final MatchOperation filterMonthPrevious = getMonthPrevious();
        final VariableOperators.Map productStast = getProductStats();

        final Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("status").is("DELIVERED")),
                Aggregation.unwind("$products"),
                Aggregation.lookup("products", "products.productId", "_id", "product_info"),
                Aggregation.unwind("$product_info"),
                Aggregation.facet()
                        .and(productDetails)
                        .as("productDetails")
                        .and(calculateProductIncome)
                        .as("totalIncome")
                        .and(filterMonthPrevious, calculateProductIncome)
                        .as("monthlyIncome"),
                Aggregation.project().and(productStast).as("productsStats"),
                Aggregation.unwind("$productsStats"),
                Aggregation.replaceRoot("$productsStats"),
                UnsetOperation.unset("$total._id", "$monthly._id"),
                Aggregation.sort(Sort.Direction.DESC, "monthly.unitsSold")
        );

        final AggregationResults<ProductReportSalesDTO> aggregate = mongoTemplate.aggregate(aggregation, "orders", ProductReportSalesDTO.class);

        return aggregate.getMappedResults();
    }

    @Override
    public List<CategoryReportSalesDTO> findCategoriesMoreSold() {
        final GroupOperation categoryDetails = getCategoryDetails();
        final GroupOperation categoryIncome = getCategoryIncome();
        final MatchOperation filterMonthPrevious = getMonthPrevious();
        final VariableOperators.Map categoriesStats = getCategoriesStats();

        final Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.unwind("$products"),
                Aggregation.lookup("products", "products.productId", "_id", "product_info"),
                Aggregation.unwind("$product_info"),
                Aggregation.unwind("$product_info.categories"),
                Aggregation.facet()
                        .and(categoryDetails)
                        .as("categoriesDetails")
                        .and(categoryIncome).as("totalIncome")
                        .and(filterMonthPrevious, categoryIncome).as("monthlyIncome"),
                Aggregation.project().and(categoriesStats).as("categoriesStats"),
                Aggregation.unwind("$categoriesStats"),
                Aggregation.replaceRoot("$categoriesStats"),
                UnsetOperation.unset("$total._id", "$monthly._id"),
                Aggregation.sort(Sort.Direction.DESC, "monthly.unitsSold")
        );

        final AggregationResults<CategoryReportSalesDTO> aggregationResults = mongoTemplate.aggregate(aggregation, "orders", CategoryReportSalesDTO.class);

        return aggregationResults.getMappedResults();
    }

    @Override
    public List<ReportSalesDTO> reportSales() {
        final Aggregation dayAggregation = getDayAggregation();
        final Aggregation monthAggregation = getMonthAggregation();
        final Aggregation transactionAggregation = getTransactionAggregation();
        final ArithmeticOperators.Round aovAggregation = getAOVAggregation();
        final ArithmeticOperators.Round dailyTransactionsAverageAggregation = getDailyTransactionsAverageAggregation();

        final Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("status").is("DELIVERED")),
                Aggregation.facet()
                        .and(dayAggregation.getPipeline().getOperations().toArray(new AggregationOperation[0])).as("day")
                        .and(monthAggregation.getPipeline().getOperations().toArray(new AggregationOperation[0])).as("month")
                        .and(transactionAggregation.getPipeline().getOperations().toArray(new AggregationOperation[0])).as("transactions"),
                Aggregation.unwind("$transactions"),
                Aggregation.addFields()
                        .addField("aov")
                        .withValue(aovAggregation)
                        .addField("dailyTransactionsAverage")
                        .withValue(dailyTransactionsAverageAggregation)
                        .build(),
                Aggregation.project("day", "month", "aov", "dailyTransactionsAverage").and("$transactions.total").as("transactions")
        );

        final AggregationResults<ReportSalesDTO> aggregationResults = mongoTemplate.aggregate(aggregation, "orders", ReportSalesDTO.class);

        return aggregationResults.getMappedResults();
    }

    @NotNull
    private static Aggregation getDayAggregation() {
        return Aggregation.newAggregation(
                Aggregation.unwind("$products"),
                Aggregation.stage("""
                        {
                          $group: {
                            _id: {
                              $dateToString: {
                                format: "%Y-%m-%d",
                                date: "$orderDate"
                              }
                            },
                            sales: {
                              $sum: "$products.quantity"
                            },
                            total: {
                              $first: "$total"
                            }
                          }
                        }
                        """),
                Aggregation.sort(Sort.Direction.ASC, "_id"),
                Aggregation.project("sales", "total")
                        .and(
                                DateOperators.dateOf(DateOperators.dateFromString("$_id"))
                                        .toString("%d-%m-%Y")
                        ).as("date")
        );
    }

    @NotNull
    private static Aggregation getMonthAggregation() {
        return Aggregation.newAggregation(
                Aggregation.project("orderDate", "total")
                        .and(
                                ArrayOperators.Reduce
                                        .arrayOf("$products")
                                        .withInitialValue(0)
                                        .reduce(ArithmeticOperators.Add.valueOf("$$value").add("$$this.quantity"))
                        ).as("sales"),
                Aggregation.stage("""
                        {
                          $group: {
                            _id: {
                              $dateToString: {
                                format: "%Y-%m",
                                date: "$orderDate"
                              }
                            },
                            sales: {
                              $sum: "$sales"
                            },
                            total: {
                              $sum: "$total"
                            }
                          }
                        }
                        """),
                Aggregation.sort(Sort.Direction.ASC, "_id"),
                Aggregation.project("sales", "total")
                        .and(
                                DateOperators.dateOf(
                                        DateOperators.dateFromString("$_id")
                                ).toString("%m-%Y")
                        ).as("date")
        );
    }

    private static Aggregation getTransactionAggregation() {
        return Aggregation.newAggregation(
                Aggregation.group().count().as("total"),
                Aggregation.project("total")
        );
    }

    private static ArithmeticOperators.Round getAOVAggregation() {
        return ArithmeticOperators.Round
                .roundValueOf(ArithmeticOperators.Divide.valueOf(
                                ArrayOperators.Reduce
                                        .arrayOf("$month")
                                        .withInitialValue(0)
                                        .reduce(ArithmeticOperators.Add.valueOf("$$value").add("$$this.total"))
                        ).divideBy("$transactions.total")
                ).place(2);

    }

    private static ArithmeticOperators.Round getDailyTransactionsAverageAggregation() {
        return ArithmeticOperators.Round.roundValueOf(
                ArithmeticOperators.Divide.valueOf("$transactions.total")
                        .divideBy(ArrayOperators.Size.lengthOfArray("$day"))
        ).place(2);
    }

    private static VariableOperators.Map getProductStats() {
        return VariableOperators.Map
                .itemsOf("$productDetails")
                .as("product")
                .andApply(ctx ->
                        new Document("productId", "$$product._id").append("name", "$$product.name")
                                .append("categories", ArrayOperators.Reduce
                                        .arrayOf("$$product.categories")
                                        .withInitialValue(Collections.emptyList())
                                        .reduce(SetOperators.SetUnion.arrayAsSet("$$value").union("$$this"))
                                        .toDocument(ctx)
                                ).append("total", ArrayOperators.ArrayElemAt
                                        .arrayOf(
                                                ArrayOperators.Filter
                                                        .filter("$totalIncome").as("total")
                                                        .by(ComparisonOperators.Eq
                                                                .valueOf("$$total._id")
                                                                .equalTo("$$product._id")
                                                        )
                                        ).elementAt(0)
                                        .toDocument(ctx)
                                ).append("monthly", ArrayOperators.ArrayElemAt
                                        .arrayOf(
                                                ArrayOperators.Filter
                                                        .filter("$monthlyIncome")
                                                        .as("month")
                                                        .by(ComparisonOperators.Eq
                                                                .valueOf("$$month._id")
                                                                .equalTo("$$product._id")
                                                        )
                                        ).elementAt(0)
                                        .toDocument(ctx)
                                )
                );
    }

    @NotNull
    private static MatchOperation getMonthPrevious() {
        return Aggregation.match(
                Criteria.expr(
                        BooleanOperators.And.and(
                                ComparisonOperators.Gte
                                        .valueOf("$orderDate")
                                        .greaterThanEqualTo(
                                                DateOperators.DateTrunc.truncateValue(
                                                        DateOperators.DateSubtract
                                                                .subtractValue(1, "month")
                                                                .fromDateOf("$$NOW")
                                                ).to("month")
                                        ),
                                ComparisonOperators.Lt
                                        .valueOf("$orderDate")
                                        .lessThan(DateOperators.DateTrunc.truncateValue("$$NOW").to("month"))
                        )
                )
        );
    }

    @NotNull
    private static GroupOperation getProductIncome() {
        return Aggregation.group("$products.productId")
                .sum("$products.quantity")
                .as("unitsSold")
                .sum(ArithmeticOperators.Multiply
                        .valueOf("$products.price")
                        .multiplyBy("$products.quantity")
                ).as("income");
    }

    @NotNull
    private static GroupOperation getProductDetails() {
        return Aggregation.group("$products.productId")
                .first("$products.name")
                .as("name")
                .addToSet(VariableOperators.Map.itemsOf("$product_info.categories")
                        .as("category")
                        .andApply(ctx ->
                                new Document("categoryId", "$$category.categoryId")
                                        .append("name", "$$category.name")
                        )
                ).as("categories");
    }

    private static VariableOperators.Map getCategoriesStats() {
        return VariableOperators.Map
                .itemsOf("$categoriesDetails")
                .as("category")
                .andApply(ctx ->
                        new Document("categoryId", "$$category._id")
                                .append("name", "$$category.name")
                                .append("total", ArrayOperators.ArrayElemAt
                                        .arrayOf(
                                                ArrayOperators.Filter
                                                        .filter("$totalIncome")
                                                        .as("total")
                                                        .by(ComparisonOperators.Eq
                                                                .valueOf("$$total._id")
                                                                .equalTo("$$category._id")
                                                        )
                                        ).elementAt(0)
                                        .toDocument(ctx)
                                ).append("monthly", ArrayOperators.ArrayElemAt
                                        .arrayOf(
                                                ArrayOperators.Filter
                                                        .filter("$monthlyIncome")
                                                        .as("month")
                                                        .by(ComparisonOperators.Eq
                                                                .valueOf("$$month._id")
                                                                .equalTo("$$category._id")
                                                        )
                                        ).elementAt(0)
                                        .toDocument(ctx)
                                )
                );
    }

    @NotNull
    private static GroupOperation getCategoryIncome() {
        return Aggregation.group("$product_info.categories.categoryId")
                .count()
                .as("unitsSold")
                .sum(ArithmeticOperators.Multiply
                        .valueOf("$products.price")
                        .multiplyBy("$products.quantity")
                )
                .as("income");
    }

    @NotNull
    private static GroupOperation getCategoryDetails() {
        return Aggregation.group("$product_info.categories.categoryId")
                .first("$product_info.categories.name")
                .as("name");
    }
}
