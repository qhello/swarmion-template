import {
  addProjectConfiguration,
  ProjectConfiguration,
  Tree,
  writeJson,
} from '@nrwl/devkit';
import { join } from 'path';

import { NormalizedSchema, PackageJson, TsConfig } from '../types';
import { createFiles } from './createFiles';
import { updateCodeWorkspace } from './updateCodeWorkspace';

interface PackageGeneratorParams {
  tree: Tree;
  options: NormalizedSchema;
  sourcePath: string;
  packageJson: (options: NormalizedSchema) => PackageJson;
  packageProjectJson: (root: string) => ProjectConfiguration;
  packageTsConfig: TsConfig;
}

export const packageGenerator = ({
  options,
  packageJson,
  packageProjectJson,
  packageTsConfig,
  sourcePath,
  tree,
}: PackageGeneratorParams): void => {
  createFiles(tree, options, sourcePath);

  writeJson(
    tree,
    join(options.packageRoot, `package.json`),
    packageJson(options),
  );

  writeJson(tree, join(options.packageRoot, `tsconfig.json`), packageTsConfig);

  const projectConfiguration = packageProjectJson(options.packageRoot);
  addProjectConfiguration(tree, options.importPath, projectConfiguration);

  updateCodeWorkspace(tree, options);
};
