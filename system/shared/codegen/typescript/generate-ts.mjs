// Generate TypeScript types from the shared JSON Schemas.
// Output: system/shared/generated/typescript/<name>.ts (one file per schema).
// The interface name in each file comes from the schema "title" (FlowRecord, Verdict, RegistryManifest).
import { compileFromFile } from 'json-schema-to-typescript';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const shared = join(here, '..', '..');
const schemasDir = join(shared, 'schemas');
const outDir = join(shared, 'generated', 'typescript');

// source stem -> output module name
const files = {
  'flow-record': 'flow_record',
  verdict: 'verdict',
  'registry-manifest': 'registry_manifest',
};

await mkdir(outDir, { recursive: true });

for (const [src, out] of Object.entries(files)) {
  const ts = await compileFromFile(join(schemasDir, `${src}.schema.json`), {
    // Schema values win; this is only the fallback for objects that do not say.
    additionalProperties: false,
    bannerComment: `/* Generated from ${src}.schema.json. Do not edit; run codegen/generate.sh. */`,
    style: { singleQuote: true },
  });
  await writeFile(join(outDir, `${out}.ts`), ts);
  console.log('wrote', `${out}.ts`);
}
