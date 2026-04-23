import coreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier";

const eslintConfig = [
    { ignores: [".next/**", "node_modules/**", "next-env.d.ts"] },
    ...coreWebVitals,
    ...nextTypescript,
    prettierConfig,
];

export default eslintConfig;
