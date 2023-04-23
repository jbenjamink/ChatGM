import { useState, useEffect, useRef } from 'react';

export default function Modal({ fastQuery, setFastQuery, children, client }) {
  const [opacity, setOpacity] = useState(0);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [textareaHeight, setTextareaHeight] = useState('40px');

  const fastQueryRef = useRef(fastQuery);
  const textareaRef = useRef(null);

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) {
      setFastQuery(false);
    }
  }

  function handleModalTransitionEnd() {
    if (!fastQuery) {
      setOpacity(0);
    }
  }

  const runQuery = async () => {
    const response = await client.openai.queryPromptedPrompt.query([
      {
        role: 'system',
        content:
          'You are being used for single use queries and are expected to return concise, fast results'
      },
      {
        role: 'user',
        content: query
      }
    ]);
    return response;
  };

  //   useEffect(() => {
  //     // Update the height of the textarea element when the content changes
  //     setTextareaHeight(`${Math.max(40, textareaRef.current.scrollHeight)}px`);
  //   }, [response]);

  return (
    <div
      className={`${
        fastQuery ? 'opacity-100' : `opacity-${opacity}`
      } fixed z-50 inset-0`}
      style={{ transition: 'opacity 0.2s ease-in-out' }}
    >
      <div className='flex h-screen items-center justify-center'>
        {/* <div
          className='fixed inset-0 transition-opacity'
          aria-hidden='true'
          onClick={handleOverlayClick}
        >
          <div className='absolute inset-0 bg-gray-500 opacity-30'></div>
        </div> */}
        {/* <span className='hidden sm:inline-block sm:align-middle sm:h-screen'></span> */}
        <div className='flex relative flex-col w-1/2'>
          <input
            className='block w-full h-[40px] z-100 pb-2 pt-2 pl-2 bg-gray !border-b !border-none border-black text-lg placeholder-gray-400 rounded-t-lg text-gray-300 text-opacity-80 focus:outline-none focus:ring-0'
            placeholder='Query'
            autoFocus
            ref={fastQueryRef}
            value={query}
            onKeyDown={e => {
              e.stopPropagation();
              if (e.key == 'Escape') {
                setFastQuery(false);
              }
              if (e.key == 'Enter') {
                setResponse('Loading...');
                runQuery().then(response => setResponse(response));
              }
            }}
            onChange={e => {
              setQuery(e.target.value);
            }}
          ></input>
          <div
            className='p-4 block rounded-b-lg !focus:outline-none text-black italic bg-gray !border-none outline-none focus:border-none focus:ring-0 box-border resize-y'
            style={{ textareaHeight }}
          >
            {response}
            <i
              className={`absolute bottom-3 right-3 fa fa-copy text-gray-800 cursor-pointer transform transition duration-300 hover:scale-125 hover:font-bold ${
                response ? '' : 'hidden'
              }`}
              onClick={() => navigator.clipboard.writeText(response)}
            ></i>
          </div>
          {/* <textarea
            className='block rounded-b-lg !focus:outline-none text-gray-300 bg-gray !border-none outline-none focus:border-none focus:ring-0 box-border resize-y'
            value={response}
            ref={textareaRef}
            onChange={e => setResponse(e.target.value)}
            style={{ textareaHeight }}
          ></textarea> */}
        </div>
        {/* <button
          className='absolute top-0 right-0 text-gray-500 hover:text-gray-800'
          onClick={() => {
            setFastQuery(false);
          }}
        ></button> */}
        {children}
      </div>
    </div>
  );
}
