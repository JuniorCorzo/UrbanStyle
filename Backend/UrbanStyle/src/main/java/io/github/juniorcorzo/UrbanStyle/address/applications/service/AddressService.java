package io.github.juniorcorzo.UrbanStyle.address.applications.service;

import io.github.juniorcorzo.UrbanStyle.address.domain.entities.AddressEntity;
import io.github.juniorcorzo.UrbanStyle.common.domain.enums.DocumentsName;
import io.github.juniorcorzo.UrbanStyle.common.domain.exceptions.DeleteDocumentFailed;
import io.github.juniorcorzo.UrbanStyle.common.domain.exceptions.DocumentNotFound;
import io.github.juniorcorzo.UrbanStyle.common.domain.exceptions.SaveDocumentFailed;
import io.github.juniorcorzo.UrbanStyle.address.domain.repository.AddressRepository;
import io.github.juniorcorzo.UrbanStyle.address.infrastructure.adapter.dto.AddressDTO;
import io.github.juniorcorzo.UrbanStyle.common.infrastructure.adapter.dtos.response.ResponseDTO;
import io.github.juniorcorzo.UrbanStyle.common.infrastructure.adapter.mapper.AddressMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class AddressService {
    private final AddressRepository addressRepository;
    private final AddressMapper addressMapper;

    public AddressService(AddressRepository addressRepository, AddressMapper addressMapper) {
        this.addressRepository = addressRepository;
        this.addressMapper = addressMapper;
    }

    public ResponseDTO<AddressDTO> getAddressByUserId(String id) {
        List<AddressEntity> addressEntities = addressRepository.findByUserId(id).orElseThrow(() -> new DocumentNotFound(DocumentsName.ADDRESS, id));
        List<AddressDTO> addressResponse = addressEntities.stream().map(addressMapper::toDTO).toList();
        return new ResponseDTO<>(HttpStatus.OK, addressResponse, "Addresses found");
    }

    public ResponseDTO<AddressDTO> createAddress(AddressDTO addressDTO) {
        AddressEntity addressEntity = addressMapper.toEntity(addressDTO);
        try {
            AddressEntity savedAddress = addressRepository.save(addressEntity);
            AddressDTO savedAddressDTO = addressMapper.toDTO(savedAddress);
            return new ResponseDTO<>(HttpStatus.CREATED, List.of(savedAddressDTO), "Address created successfully");
        } catch (Exception e) {
            log.error("Error creating address: {}", e.getMessage(), e);
            throw new SaveDocumentFailed(DocumentsName.ADDRESS);
        }
    }

    public ResponseDTO<AddressDTO> updateAddress(AddressDTO addressDTO) {
        AddressEntity addressEntity = addressMapper.toEntity(addressDTO);
        try {

            AddressEntity updatedAddress = addressRepository.save(addressEntity);
            AddressDTO updatedAddressDTO = addressMapper.toDTO(updatedAddress);
            return new ResponseDTO<>(HttpStatus.OK, List.of(updatedAddressDTO), "Address updated successfully");
        } catch (Exception e) {
            log.error("Error updating address: {}", e.getMessage(), e);
            throw new SaveDocumentFailed(DocumentsName.ADDRESS);
        }
    }

    public ResponseDTO<AddressDTO> deleteAddress(String id) {
        try {
            addressRepository.deleteById(id);
            return new ResponseDTO<>(HttpStatus.OK, "Address deleted successfully");
        } catch (Exception e) {
            log.error("Error deleting address: {}", e.getMessage(), e);
            throw new DeleteDocumentFailed(DocumentsName.ADDRESS, id);
        }
    }
}
