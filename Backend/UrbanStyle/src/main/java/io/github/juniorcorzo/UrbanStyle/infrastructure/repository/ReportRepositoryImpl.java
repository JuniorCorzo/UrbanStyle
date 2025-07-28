package io.github.juniorcorzo.UrbanStyle.infrastructure.repository;

import io.github.juniorcorzo.UrbanStyle.domain.dtos.ReportSalesDTO;
import io.github.juniorcorzo.UrbanStyle.domain.dtos.SalesRecord;
import io.github.juniorcorzo.UrbanStyle.domain.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.DateOperators;
import org.springframework.data.mongodb.core.query.Criteria;

import java.util.List;

@RequiredArgsConstructor
public class ReportRepositoryImpl implements ReportRepository {
    private final MongoTemplate mongoTemplate;

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
        final Aggregation dayAggregation = Aggregation.newAggregation(
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
                              $sum: "$total"
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

        final Aggregation monthAggregation = Aggregation.newAggregation(
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
                              $sum: "$products.quantity"
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

        final Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("status").is("DELIVERED")),
                Aggregation.unwind("$products"),
                Aggregation.facet()
                        .and(dayAggregation.getPipeline().getOperations().toArray(new AggregationOperation[0])).as("day")
                        .and(monthAggregation.getPipeline().getOperations().toArray(new AggregationOperation[0])).as("month")
        );

        final AggregationResults<ReportSalesDTO> aggregationResults = mongoTemplate.aggregate(aggregation, "orders", ReportSalesDTO.class);

        return aggregationResults.getMappedResults();
    }
}
