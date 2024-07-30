import { useFrame } from 'frames.js/react'

export default function Frame() {
  const frame = useFrame()

  if (!frame.isValid) {
    return <div>Invalid frame</div>
  }

  return (
    <div>
      <img src={frame.image} alt="Frame" />
      {frame.buttons.map((button, index) => (
        <button key={index} onClick={() => frame.postMessage({ buttonIndex: index + 1 })}>
          {button.label}
        </button>
      ))}
      {frame.input && (
        <input
          type="text"
          placeholder={frame.input.text}
          onChange={(e) => frame.setInput(e.target.value)}
        />
      )}
    </div>
  )
}
