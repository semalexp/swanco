import { fetchConfig } from './config';
import {
  Enum,
  fetchEnums
} from './enums';
import {
  fetchModels,
  Model
} from './models';
import { fetchModule } from './module';
import {
  fetchServices,
  Service
} from './services';
import {
  Directory,
  File,
  generate,
  getData,
  getProtocol,
  rmdir,
  showReport,
  wrap
} from './utils';

interface Options {
  input: string;
  output?: string;
  skipServices?: boolean;
  skipModule?: boolean;
  auth?: string;
  hideReport?: boolean;
}

export = async (options: Options) => {
  const {input, auth, output = 'src/app/api', skipServices = false, skipModule = false, hideReport = false} = options;

  if (!input) {
    return Promise.reject(`Missing required argument: input`);
  }

  const spec = await getData(input, auth);
  const {swagger} = spec;

  if (parseInt(swagger, 0) !== 2) {
    throw new Error(`Invalid Swagger data or version of specification is not supported`);
  }

  rmdir(output);

  const root: Directory<File> = {
    directory: '.',
    content: []
  };

  const models = wrap<Model>(fetchModels(spec), 'models');

  if (!skipServices) {
    const variables: File = {
      name: 'Variables',
      file: 'variables',
      template: 'variables'
    };
    const config = fetchConfig(spec, getProtocol(input));
    const services = fetchServices(spec, config);
    const enums = wrap<Enum>(fetchEnums(), 'enums');

    if (!skipModule) {
      root.content.push(fetchModule(config, services));
    }

    root.content.push(config, variables, wrap<Service>(services, 'services'), models, enums);
    if (!hideReport) {
      showReport(models.content.length, enums.content.length, services.length);
    }
  } else {
    const enums_1 = wrap<Enum>(fetchEnums(), 'enums');
    root.content.push(models, enums_1);
    if (!hideReport) {
      showReport(models.content.length, enums_1.content.length, 0);
    }
  }

  generate(output, root);
};
