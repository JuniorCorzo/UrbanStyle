/// <reference types="astro/client" />
declare namespace App {
  interface Locals {
    user: import("@/interface/user.interface").User;
    accessToken: string;
  }
}

interface ImportMetaEnv {
  PUBLIC_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
