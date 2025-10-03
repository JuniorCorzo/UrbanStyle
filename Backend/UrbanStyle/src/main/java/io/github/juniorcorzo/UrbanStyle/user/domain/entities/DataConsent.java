package io.github.juniorcorzo.UrbanStyle.user.domain.entities;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class DataConsent {
    private boolean accepted;
    private LocalDateTime acceptedAt;
    private String version;
    private String ipAddress;

}
