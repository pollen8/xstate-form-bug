import {
  useInterpret,
  useSelector,
} from '@xstate/react';

import { parentMachine } from './parent.machine';

function App() {
  console.log('render App');
  const service = useInterpret(parentMachine.withConfig({
  }), {
    id: 'edit',
    devTools: true,
  });
  service.start();
  const { send } = service;
  console.log(service.getSnapshot());
  const errors = useSelector(service, ({context}) => context.formActor.getSnapshot()?.context.errors);
  const touched = useSelector(service, ({context}) => context.formActor.getSnapshot()?.context.touched);
  console.log('APP errors', errors);
  console.log('APP touched', touched);
  return (
    <div className="App">
      <ul>
      <li>Typing in a character in the input should first perform an action to update the touched context</li>
      <li>Then invoke a validation service in the formActor.</li>
      <li>The validation service's onDone event then defines an action to set the formActions context.errors</li>
      <li>The Apps useSelectors do pick up on the touched context changes, but not on the errors</li>
      <li>Typing a second character into the field shows us the previous error</li>
      </ul>
      <form name="edit">
        <label htmlFor="fileName">
          File name
        </label>
        <input
         onChange={(e) => send({ type: 'SET_FORM_DATA', data: { fileName: e.target.value } })}
         onBlur={(e) => send({ type: 'SET_FORM_DATA', data: { fileName: e.target.value } })}
          id="fileName"
        />
        <button
          type="button"
          color="primary"
          onClick={() => send({ type: 'SAVE' })}>
          submit
        </button>
        <br />
        errors: {JSON.stringify(errors)}
      </form>
    </div>
  );
}

export default App;
