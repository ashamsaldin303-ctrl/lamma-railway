import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const eslintConfig = [...nextCoreWebVitals, ...nextTypescript, {
  rules: {
    // TypeScript rules (re-enabled as warnings)
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-non-null-assertion": "warn",
    "@typescript-eslint/ban-ts-comment": "warn",

    // React rules
    "react-hooks/exhaustive-deps": "warn",
    "react-hooks/purity": "off", // Date.now() in server components is fine
    "react/no-unescaped-entities": "off",
    "react/display-name": "off",

    // Next.js rules
    "@next/next/no-img-element": "warn",
    "@next/next/no-html-link-for-pages": "off",

    // React Compiler (too strict for this project's patterns)
    "react-compiler/react-compiler": "off",

    // General rules (re-enabled)
    "prefer-const": "warn",
    "no-unused-vars": "off", // use TS rule instead
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "no-debugger": "error",
    "no-empty": "warn",
    "no-irregular-whitespace": "error",
    "no-unreachable": "error",
    "no-useless-escape": "warn",
  },
}, {
  ignores: [
    "node_modules/**",
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "examples/**",
    "skills",
    "mini-services/**",  // mini-service has its own package
  ],
}];

export default eslintConfig;
