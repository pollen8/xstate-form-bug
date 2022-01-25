import { useInterpret } from '@xstate/react';

import { parentMachine } from './parent.machine';

function App() {
  console.log('render App');
  const service = useInterpret(parentMachine.withConfig({
  }), {
    id: 'edit',
  });
  const { send } = service;
  return (
    <div className="App">

      <form name="edit">
        <label htmlFor="fileName">
          File name
        </label>
        <input
          id="fileName"
        />
        <button
          type="button"
          color="primary"
          onClick={() => send({ type: 'SAVE' })}>
          submit
        </button>
      </form>
    </div>
  );
}

export default App;
