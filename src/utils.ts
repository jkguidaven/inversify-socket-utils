import "reflect-metadata";
import { interfaces as inversifyInterfaces } from "inversify";
import { METADATA_KEY, NO_CONTROLLERS_FOUND, DUPLICATED_CONTROLLER_NAME } from "./constants";
import { Interfaces } from "./interfaces";
import { TYPE } from "./constants";

export function bindAllControllerMetadataToContainer(container: inversifyInterfaces.Container) {
  let arrayOfControllerMetadata: Interfaces.ControllerMetadata[] = Reflect.getMetadata(
      METADATA_KEY.Controller,
      Reflect
  ) || [];

  arrayOfControllerMetadata.forEach((metadata) => {
      const constructor = metadata.target;

      if (container.isBoundNamed(TYPE.Controller, metadata.target.name)) {
          throw new Error(DUPLICATED_CONTROLLER_NAME(metadata.target.name));
      }

      container.bind<Interfaces.Controller>(TYPE.Controller)
                    .to(constructor)
                    .whenTargetNamed(metadata.target.name);
  });
}

export function getControllersFromContainer(
  container: inversifyInterfaces.Container,
  forceControllers: boolean
) {
  if (container.isBound(TYPE.Controller)) {
      return container.getAll<Interfaces.Controller>(TYPE.Controller);
  } else if (forceControllers) {
      throw new Error(NO_CONTROLLERS_FOUND);
  } else {
      return [];
  }
}

export function getControllerMetadata(constructor: any) {
  const controllerMetadata: Interfaces.ControllerMetadata = Reflect.getMetadata(
    METADATA_KEY.Controller,
    constructor
  );

  return controllerMetadata;
}

export function getActionMetadata(constructor: any) {
  const actionMetadata: Interfaces.ControllerActionMetadata[] = Reflect.getMetadata(
    METADATA_KEY.Action,
    constructor
  );

  return actionMetadata;
}

export function getParameterMetadata(constructor: any) {
  const parameterMetadata: Interfaces.ControllerParameterMetadata = Reflect.getMetadata(
    METADATA_KEY.Parameter,
    constructor
  );

  return parameterMetadata;
}

export function cleanUpMetadata() {
  Reflect.defineMetadata(
    METADATA_KEY.Controller,
    [],
    Reflect
  );
}
