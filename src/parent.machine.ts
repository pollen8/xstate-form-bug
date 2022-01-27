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
  data: {},
  formActor: {} as BuildFormActorRef<FormData>,
}, {
  events: {
    'SAVE': () => ({}),
    'SET_FORM_DATA': (data: Partial<FormData>) => ({ data }),
  }
});

const formMachine = createFormMachine<FormData>({
  data: {},
  id: 'edit',
});


export const parentMachine = parentModel.createMachine({
  id: 'parentMachine',
  initial: 'idle',
  entry: [
    assign({
      formActor: () => spawn(formMachine, {
        autoForward: true,
        name: 'form',
        // sync: true,
      })
    })
  ],
  states: {
    idle: {},
  }
});
