/// <reference types="astro/client" />
declare namespace App {
  interface Locals {
    user: import("@/interface/user.interface").User;
  }
}

interface ImportMetaEnv {
  PUBLIC_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
