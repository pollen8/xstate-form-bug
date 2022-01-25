/**
 * A single page form.
 * If you want a new form invoke the machine with a `loadData` service which return a promise with an empty object.
 * otherwise use loadData to supply the form's initial data.
 */

import {
  ActorRef,
  State,
} from 'xstate';
import { createModel } from 'xstate/lib/model';
import {
  ModelContextFrom,
  ModelEventsFrom,
} from 'xstate/lib/model.types';

const formModel = <T>() => createModel(
  {
    data: {} as Partial<T>,
    errors: {} as Record<keyof Partial<T>, any>,
    touched: [] as Array<keyof Partial<T>>,
  },
  {
    events: {
      'SET_FORM_DATA': (data: Partial<T>) => ({ data }),
      'SAVE': () => ({}),
      'CANCEL': () => ({}),
    },
  },
);

// This Wrapper class allows us to create a formModel with a given generic,
// assigned to its model prop.
class Wrapper<T extends unknown> {
  model = () => formModel<T>();
}

// Generic type creation
type BuildFormContext<FormContext extends unknown> = ModelContextFrom<ReturnType<Wrapper<FormContext>['model']>>;
type BuildFormEvents<FormContext extends unknown> = ModelEventsFrom<ReturnType<Wrapper<FormContext>['model']>>;
export type BuildFormActorRef<FormContext extends unknown> = ActorRef<BuildFormEvents<FormContext>, State<BuildFormContext<FormContext>>>;

export interface CreateFormMachine<T> {
  data: Partial<T>;
  id?: string;
}

/**
 * Function to create a strongly typed form machine.
 * Does not handle multi page forms.
 * type T defines the structure for the form's data.
 */
export const createFormMachine = <T extends Object>({
  data,
  id,
}: CreateFormMachine<T>) => {
  console.log('create form machine');
  return formModel<T>().createMachine({
    id: id ?? 'edit.form',
    context: {
      data,
      errors: {} as Record<keyof Partial<T>, any>,
      touched: [],
    },
    initial: 'initialise',
    states: {
      initialise: {
        invoke: {
          src: 'loadData',
          onDone: {
            target: 'done',
          },
          onError: {
            target: 'error',
          }
        },
      },
      done: {},
      error: {},
    }
  },
    {
    });
};
