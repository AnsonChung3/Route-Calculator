/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_BUNDLE_DATA: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
