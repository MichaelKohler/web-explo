import { FormEvent, useCallback, useEffect, useRef, useState } from 'react'

import './App.css'

// The worker file is in the `public` folder
const worker = new Worker("worker.js");

function App() {
  const [messages, setMessages] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null);

  const addMessage = (message: string) => {
    setMessages((messages) => [...messages, message])
  }

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (worker) {
      worker.onmessage = (e) => {
        addMessage(e.data)
      }
    }
  }, [])

  const sendMessageToWorker = useCallback((message: string) => {
    if (worker) {
      worker.postMessage({ message })
    }
  }, []);

  const handleSubmit = (event: FormEvent) => {
    event?.preventDefault()

    if (!inputRef?.current?.value) {
      console.error("No input found!")
      return
    }

    sendMessageToWorker(inputRef?.current?.value)

    inputRef.current.value = ""
  }

  const getFileContent = () => {
    if (worker) {
      worker.postMessage({ command: "read" })
    }
  }

  const truncate = () => {
    if (worker) {
      worker.postMessage({ command: "truncate" })
    }
  }

  const save = async () => {
    // FileSystemFileHandle
    const saveFileHandle = await window.showSaveFilePicker();

    const opfsRoot = await navigator.storage.getDirectory()
    const fileHandle = await opfsRoot.getFileHandle("received-messages.txt", {
      create: false,
    })
    const fileBlob = await fileHandle.getFile()
    
    const writableStream = await saveFileHandle.createWritable();
    await writableStream.write(fileBlob, { type: "write", position: 0 })
    await writableStream.close()
  }

  return (
    <>
      <h1>Web Worker + Origin Private File System</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="line" ref={inputRef} />
        <button type="submit">
          Append line
        </button>
      </form>
      <button onClick={() => { getFileContent() }}>
        Get file content..
      </button>
      <button onClick={() => { truncate() }}>
        Truncate content..
      </button>
      <button onClick={() => { save() }}>
        Save (not supported in Firefox)
      </button>
      {messages.length > 0 && <h2>Messages back from worker:</h2>}
      <ul>
        {messages.map((message) => (<li key={message}>{message || "<empty>"}</li>))}
      </ul>
    </>
  )
}

export default App
