package io.github.juniorcorzo.UrbanStyle.application.commands.attributes;

import io.github.juniorcorzo.UrbanStyle.domain.entities.Attribute;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Predicate;
import java.util.stream.Collectors;

public class AttributeCommandFactory {
    public static List<AttributeCommand> createAttributeCommand(
            final String productId,
            final List<Attribute> currentAttributes,
            final List<Attribute> AttributesToUpdate
    ) {
        final Map<String, Attribute> actualAttributesMap = currentAttributes
                .parallelStream()
                .collect(Collectors.toMap(Attribute::getSku, attribute -> attribute));

        final Map<String, Attribute> updateAttributesMap = AttributesToUpdate
                .parallelStream()
                .collect(Collectors.toMap(Attribute::getSku, attribute -> attribute));

        final List<AttributeCommand> attributeCommands = new ArrayList<>(updateAttributesMap.entrySet()
                .parallelStream()
                .map((attributeEntry) -> createUpsertAttributeCommand(
                                productId,
                                attributeEntry.getValue(),
                                actualAttributesMap.get(attributeEntry.getKey())
                        )
                ).filter(Optional::isPresent)
                .map(Optional::get)
                .toList());

        attributeCommands.addAll(
          actualAttributesMap.entrySet()
                  .parallelStream()
                  .filter(Predicate.not(attributeEntry -> updateAttributesMap.containsKey(attributeEntry.getKey())))
                  .map(attributeEntry -> createDeleteAttributeCommand(productId, attributeEntry.getKey()))
                  .filter(Optional::isPresent)
                  .map(Optional::get)
                  .toList()
        );

        return attributeCommands;
    }

    private static Optional<AttributeCommand> createUpsertAttributeCommand(
            final String productId,
            final Attribute currentAttribute,
            final Attribute updateAttribute
    ) {
        if (currentAttribute == null) {
            return Optional.of(InsertAttributeCommand.builder()
                    .productId(productId)
                    .insertAttribute(updateAttribute)
                    .build());
        }

        if (!currentAttribute.equals(updateAttribute)) {
            return Optional.of(UpdateAttributeCommand.builder()
                    .productId(productId)
                    .sku(currentAttribute.getSku())
                    .updateAttribute(updateAttribute)
                    .build());
        }

        return Optional.empty();
    }

    private static Optional<AttributeCommand> createDeleteAttributeCommand(String productId, String sku) {
        return Optional.of(
                DeleteAttributeCommand.builder()
                        .productId(productId)
                        .sku(sku)
                        .build()
        );
    }
}
