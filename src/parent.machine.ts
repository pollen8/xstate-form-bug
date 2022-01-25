import {
  assign,
  spawn,
} from 'xstate';
import { createModel } from 'xstate/lib/model';

import {
  BuildFormActorRef,
  createFormMachine,
} from './form.machine';

interface Item {
  id: string;
  name: string;
}
interface FormData {
  fileName: string;
  item: Item;
}

const parentModel = createModel({
  items: [] as Item[],
  formActor: {} as BuildFormActorRef<FormData>,
}, {
  events: {
    'SAVE': () => ({}),
  }
});

const formMachine = createFormMachine<FormData>({
  data: {},
  id: 'edit',
});


export const parentMachine = parentModel.createMachine({
  id: 'parentMachine',
  initial: 'initialise',
  entry: [
    assign({
      formActor: () => spawn(formMachine, {
        autoForward: true,
        name: 'form',
        sync: true,
      })
    })
  ],
  states: {
    initialise: {
      invoke: {
        src: 'loadItems',
        onDone: {
          actions: (context, event: any) => context.items = event.data,
          target: 'idle',
        },
      },
    },
    idle: {},
    save: {
      invoke: {
        src: 'save',
      },
    },
  }
});
