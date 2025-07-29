package io.github.juniorcorzo.UrbanStyle.infrastructure.repository;

import io.github.juniorcorzo.UrbanStyle.domain.dtos.ReportSalesDTO;
import io.github.juniorcorzo.UrbanStyle.domain.dtos.SalesRecord;
import io.github.juniorcorzo.UrbanStyle.domain.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;

import java.util.List;

@RequiredArgsConstructor
public class ReportRepositoryImpl implements ReportRepository {
    private final MongoTemplate mongoTemplate;

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

    @Override
    public List<SalesRecord> findProductsMoreSold() {
        final Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.stage("{ $match: { status: 'DELIVERED' } }"),
                Aggregation.stage("{ '$unwind': '$products' }"),
                Aggregation.stage("{ '$group': { _id: '$products.name', 'sold': { $sum: '$products.quantity' } } }"),
                Aggregation.stage("{ '$project': { '_id': 0, 'sold': 1, name: '$_id' } }"),
                Aggregation.stage("{ '$sort': { sold: -1 } }"),
                Aggregation.limit(10)
        );
        final AggregationResults<SalesRecord> aggregate = mongoTemplate.aggregate(aggregation, "orders", SalesRecord.class);

        return aggregate.getMappedResults();
    }

    @Override
    public List<SalesRecord> findCategoriesMoreSold() {
        final Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.stage("{ $match: { status: 'DELIVERED' } }"),
                Aggregation.stage("{ $unwind: '$products' }"),
                Aggregation.stage("{ $lookup: { from: 'products', localField: 'products.productId', foreignField: '_id', as: 'product_info' } }"),
                Aggregation.stage("{ $unwind: { path: '$product_info' } }"),
                Aggregation.stage("{ $unwind: { path: '$product_info.categories' } }"),
                Aggregation.stage("{ $group: { _id:  '$product_info.categories.name', sold: { $sum: 1 } } }"),
                Aggregation.stage("{ $project: { _id: 0, name: '$_id', sold: 1 } }"),
                Aggregation.stage("{ $sort: { sold: -1 } }"),
                Aggregation.limit(10)
        );
        final AggregationResults<SalesRecord> aggregationResults = mongoTemplate.aggregate(aggregation, "orders", SalesRecord.class);

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
}
