package io.github.juniorcorzo.UrbanStyle.terms.application.utils;

import java.util.Arrays;
import java.util.stream.Collectors;

import io.github.juniorcorzo.UrbanStyle.terms.domain.enums.Semver;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class SemverHelper {
  private final String currentVersion;
  private final Semver semverType;

  public String getNewVersion() {
    return switch (semverType) {
        case MAJOR -> this.updateMajorVersion();
        case MINOR -> this.updateMinorVersion();
        case PATCH -> this.updatePatchVersion();
        case null -> "1.0.0";
    };
  }

  private String updateMajorVersion() {
      final int[] version = this.prepareVersion();
      version[0]++;
      version[1] = 0;
      version[2] = 0;

      return this.getVersion(version);
  }

  private String updateMinorVersion() {
      final int[] version = this.prepareVersion();
      version[1]++;
      version[2] = 0;

      return this.getVersion(version);
  }

  private String updatePatchVersion() {
    final int[] version = this.prepareVersion();
    version[2]++;

    return this.getVersion(version);
  }




  private String getVersion(final int[] newVersion) {
    return Arrays.stream(newVersion)
            .mapToObj(String::valueOf)
            .collect(Collectors.joining("."));
  }

  private int[] prepareVersion() {
    return Arrays.stream(this.currentVersion.split("\\."))
        .mapToInt(Integer::parseInt)
        .toArray();
  }
}
