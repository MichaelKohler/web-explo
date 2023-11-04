// FileSystemFileHandle
let fileHandle = null;
// FileSystemSyncAccessHandle (only available in Workers)
let accessHandle = null;

const setup = async () => {
  // FileSystemDirectoryHandle
  const opfsRoot = await navigator.storage.getDirectory()
  fileHandle = await opfsRoot.getFileHandle("received-messages.txt", {
    create: true,
  })

  if (!accessHandle) {
    accessHandle = await fileHandle.createSyncAccessHandle()
  }
}

setup()

const textEncoder = new TextEncoder();

const handleMessage = async (message) => {
  const content = textEncoder.encode(message + '\n')
  const fileSize = accessHandle.getSize()
  accessHandle.write(content, { type: "write", position: fileSize })
  accessHandle.flush()

  const result = `Message "${message}" successfully written to file!`
  postMessage(result)
}

const readFullFile = () => {
  const size = accessHandle.getSize()
  const dataView = new DataView(new ArrayBuffer(size))
  accessHandle.read(dataView)
  const textDecoder = new TextDecoder();
  const decoded = textDecoder.decode(dataView)
  return decoded
}

onmessage = (messageEvent) => {
  console.log("Message received from main script", messageEvent.data)
  if (messageEvent.data.message) {
    handleMessage(messageEvent.data.message)
  }

  if (messageEvent.data.command) {
    switch (messageEvent.data.command) {
      case "read":
        postMessage(readFullFile())
        break
      case "truncate":
        accessHandle.truncate(0)
        break
      default:
        console.error('Unknown command')
    }
  }
}
